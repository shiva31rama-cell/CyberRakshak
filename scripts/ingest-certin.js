const fs = require("node:fs");
const path = require("node:path");

const SOURCE_URL = "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST02&year=2026";
const OUTPUT = path.resolve(__dirname, "../data/threats/ingested/cert-in-latest.json");

const decode = (value) => value
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");

const stripTags = (value) => decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

const normalizeDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
};

const extractAdvisories = (html) => {
  const results = [];
  const pattern = /(?:href\s*=\s*["']([^"']+)["'][^>]*>)?\s*(?:<[^>]*>)?\s*(CERT-In Advisory\s+CIAD-\d{4}-\d{4})\s*([^<]*?)\s*(?:\(|<)/gi;
  let match;

  while ((match = pattern.exec(html)) && results.length < 30) {
    const id = match[2].trim();
    if (results.some((item) => item.id === id)) continue;
    results.push({
      id,
      title: stripTags(match[3] || "CERT-In security advisory"),
      advisoryUrl: match[1] ? new URL(match[1], SOURCE_URL).href : SOURCE_URL,
    });
  }

  return results;
};

const buildRecord = (item) => ({
  id: `cert-in-${item.id.toLowerCase()}`,
  title: item.title || item.id,
  severity: "unknown",
  categories: ["official-advisory"],
  description: "Automatically ingested CERT-In advisory metadata. Open the official advisory before treating technical details as verified.",
  indicators: [],
  keywords: ["CERT-In", item.id],
  actions: ["Review the official advisory.", "Apply vendor-recommended security updates when relevant.", "Do not infer personal risk from advisory metadata alone."],
  sourceReferences: [{
    sourceId: "cert-in",
    url: item.advisoryUrl,
    trustTier: 1,
    verificationStatus: "official-source",
  }],
  publishedAt: null,
  retrievedAt: new Date().toISOString(),
  confidence: 0.98,
  region: "IN",
  provenance: {
    method: "scheduled-source-ingestion",
    sourcePage: SOURCE_URL,
    advisoryId: item.id,
  },
});

async function main() {
  const response = await fetch(SOURCE_URL, { headers: { "User-Agent": "CyberRakshak-Threat-Intelligence/2.0" } });
  if (!response.ok) throw new Error(`CERT-In source returned HTTP ${response.status}`);

  const html = await response.text();
  const advisories = extractAdvisories(html);
  if (!advisories.length) throw new Error("No CERT-In advisories were parsed; refusing to overwrite the ingestion artifact.");

  const payload = {
    schemaVersion: "1.0",
    source: { id: "cert-in", url: SOURCE_URL, trustTier: 1 },
    generatedAt: new Date().toISOString(),
    records: advisories.map(buildRecord),
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Ingested ${payload.records.length} CERT-In advisory records.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
