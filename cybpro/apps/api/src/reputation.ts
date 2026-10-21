export type ReputationResult = {
  status: "not_configured" | "checked" | "unavailable" | "not_checked_private_address";
  source: "Google Safe Browsing" | null;
  checkedAt: string | null;
  matches: string[];
  detail: string;
};

type FetchLike = typeof fetch;

function isPrivateOrLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "::1" ||
    host === "::" ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    host.startsWith("fe80:")
  ) return true;

  const octets = host.split(".");
  if (octets.length !== 4 || octets.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return false;
  const [a, b] = octets.map(Number);
  return a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a === 0;
}

/**
 * Optional Google Safe Browsing lookup. It contacts only Google's fixed API endpoint;
 * it never fetches or follows the submitted URL. The URL is shared with Google when
 * this integration is enabled, so callers should disclose that before users submit it.
 */
export async function checkUrlReputation(
  input: string,
  options: { apiKey?: string; fetchImpl?: FetchLike; timeoutMs?: number } = {}
): Promise<ReputationResult> {
  const apiKey = options.apiKey ?? process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return {
      status: "not_configured",
      source: null,
      checkedAt: null,
      matches: [],
      detail: "Live reputation lookup is not configured. Only local URL traits were checked."
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    return {
      status: "unavailable", source: "Google Safe Browsing", checkedAt: null, matches: [],
      detail: "Reputation lookup was skipped because the URL could not be parsed."
    };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      status: "unavailable", source: "Google Safe Browsing", checkedAt: null, matches: [],
      detail: "Reputation lookup supports only HTTP and HTTPS URLs."
    };
  }
  if (isPrivateOrLocalHostname(parsed.hostname)) {
    return {
      status: "not_checked_private_address", source: null, checkedAt: null, matches: [],
      detail: "Private or local addresses are not sent to an external reputation provider."
    };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);
  try {
    const endpoint = new URL("https://safebrowsing.googleapis.com/v4/threatMatches:find");
    endpoint.searchParams.set("key", apiKey);
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        client: { clientId: "cybpro-preview", clientVersion: "0.1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: parsed.href }]
        }
      })
    });

    if (!response.ok) {
      return {
        status: "unavailable", source: "Google Safe Browsing", checkedAt: new Date().toISOString(), matches: [],
        detail: response.status === 429
          ? "The provider rate limit was reached; no reputation verdict is available."
          : "The reputation provider could not complete the lookup; no reputation verdict is available."
      };
    }

    const payload: unknown = await response.json();
    const matches = typeof payload === "object" && payload !== null && "matches" in payload && Array.isArray(payload.matches)
      ? payload.matches
          .map((match: unknown) => {
            if (typeof match !== "object" || match === null || !("threatType" in match)) return null;
            const threatType = (match as { threatType?: unknown }).threatType;
            return typeof threatType === "string" ? threatType : null;
          })
          .filter((value): value is string => value !== null)
      : [];

    return {
      status: "checked",
      source: "Google Safe Browsing",
      checkedAt: new Date().toISOString(),
      matches,
      detail: matches.length
        ? "The provider returned one or more threat matches. Avoid visiting this URL."
        : "The provider returned no known threat match. This does not prove the URL is safe."
    };
  } catch {
    return {
      status: "unavailable", source: "Google Safe Browsing", checkedAt: new Date().toISOString(), matches: [],
      detail: "The reputation provider timed out or could not be reached; no reputation verdict is available."
    };
  } finally {
    clearTimeout(timeout);
  }
}
