const FEED_URL = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1";
const MAX_FEED_BYTES = 1024 * 1024;
const FEED_CACHE_MS = 60 * 1000;
const STOP_WORDS = new Set([
  "about", "after", "again", "against", "among", "because", "before", "being",
  "between", "could", "does", "from", "have", "into", "just", "more", "most",
  "official", "please", "should", "that", "their", "there", "these", "they",
  "this", "those", "through", "under", "were", "what", "when", "where", "which",
  "while", "with", "would", "your", "will", "been", "news", "viral",
]);
let cachedFeed = null;

function decodeXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(parseInt(decimal, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml, tagName) {
  const expression = new RegExp("<" + tagName + "\\b[^>]*>([\\s\\S]*?)<\\/" + tagName + ">", "i");
  return decodeXml(xml.match(expression)?.[1] || "");
}

function parseRss(xml) {
  const items = [];
  for (const match of String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const itemXml = match[1];
    const title = readTag(itemXml, "title").slice(0, 400);
    const description = readTag(itemXml, "description").slice(0, 1000);
    const link = readTag(itemXml, "link") || readTag(itemXml, "guid");
    let safeUrl = null;

    try {
      const parsed = new URL(link);
      if (parsed.protocol === "https:" && ["pib.gov.in", "www.pib.gov.in"].includes(parsed.hostname.toLowerCase())) {
        safeUrl = parsed.href;
      }
    } catch {
      // Ignore feed items without a valid official HTTPS link.
    }

    if (!title || !safeUrl) continue;
    const parsedDate = Date.parse(readTag(itemXml, "pubDate"));
    items.push({
      title,
      description,
      url: safeUrl,
      publishedAt: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : null,
    });
  }
  return items;
}

function claimTerms(claim) {
  return [...new Set(
    String(claim).toLocaleLowerCase("en-IN").match(/[\p{L}\p{N}]{4,}/gu) || []
  )].filter((term) => !STOP_WORDS.has(term)).slice(0, 12);
}

function textTerms(value) {
  return new Set(String(value).toLocaleLowerCase("en-IN").match(/[\p{L}\p{N}]{4,}/gu) || []);
}

async function readResponseWithinLimit(response) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_FEED_BYTES) {
    throw new Error("Official feed exceeds the response size limit");
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      total += result.value.byteLength;
      if (total > MAX_FEED_BYTES) {
        await reader.cancel();
        throw new Error("Official feed exceeds the response size limit");
      }
      chunks.push(Buffer.from(result.value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function loadFeed(fetchImpl = globalThis.fetch) {
  if (cachedFeed && cachedFeed.expiresAt > Date.now()) return cachedFeed.items;
  if (typeof fetchImpl !== "function") throw new Error("This Node.js runtime does not provide fetch");

  const response = await fetchImpl(FEED_URL, {
    method: "GET",
    redirect: "manual",
    signal: AbortSignal.timeout(4000),
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": "CyberRakshak/2.0 official evidence lookup",
    },
  });

  if (response.status !== 200) throw new Error("Official feed returned a non-success response");
  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!["application/rss+xml", "application/xml", "text/xml"].includes(contentType)) {
    throw new Error("Official feed returned an unexpected content type");
  }

  const items = parseRss(await readResponseWithinLimit(response));
  cachedFeed = { expiresAt: Date.now() + FEED_CACHE_MS, items };
  return items;
}

async function findOfficialEvidence(claim, options = {}) {
  if (process.env.SOCIAL_EVIDENCE_LOOKUP_ENABLED === "false") {
    return { status: "disabled", items: [] };
  }

  const terms = claimTerms(claim);
  if (terms.length < 2) return { status: "insufficient_terms", items: [] };

  try {
    const feedItems = await loadFeed(options.fetchImpl);
    const matches = feedItems
      .map((item) => {
        const itemTokens = textTerms(item.title + " " + item.description);
        const matchingTerms = terms.filter((term) => itemTokens.has(term));
        return { item, matchingTerms, matchCount: matchingTerms.length };
      })
      .filter((candidate) => candidate.matchCount >= 2)
      .sort((a, b) => b.matchCount - a.matchCount ||
        Date.parse(b.item.publishedAt || 0) - Date.parse(a.item.publishedAt || 0))
      .slice(0, 3)
      .map(({ item, matchingTerms, matchCount }) => ({
        source: "Press Information Bureau (PIB) press-release RSS",
        title: item.title,
        summary: item.description,
        url: item.url,
        publishedAt: item.publishedAt,
        matchingTerms,
        matchCount,
      }));

    return { status: matches.length ? "candidate_matches" : "no_matches", items: matches };
  } catch {
    // Preserve claim triage when an external source is slow or unavailable.
    return { status: "unavailable", items: [] };
  }
}

module.exports = { FEED_URL, findOfficialEvidence, parseRss };
