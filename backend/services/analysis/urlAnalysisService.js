const SUSPICIOUS_TLDS = new Set([".zip", ".mov", ".click", ".top", ".xyz", ".work", ".loan", ".gq", ".tk", ".ml", ".cf", ".ga"]);
const SHORTENER_HOSTS = new Set(["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "shorturl.at"]);

// These are detection hints, not a complete allow-list of every legitimate service
// domain. A matching domain suffix only avoids this one impersonation warning; it
// never proves that a URL, page, or message is safe.
const BRAND_DOMAIN_POLICIES = [
  { brand: "SBI", token: "sbi", domains: ["sbi.co.in", "onlinesbi.sbi"] },
  { brand: "HDFC Bank", token: "hdfc", domains: ["hdfcbank.com"] },
  { brand: "ICICI Bank", token: "icici", domains: ["icicibank.com"] },
  { brand: "Axis Bank", token: "axis", domains: ["axisbank.com"] },
  { brand: "Reserve Bank of India", token: "rbi", domains: ["rbi.org.in"] },
];

function hostnameMatchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function hostnameContainsBrandToken(hostname, token) {
  return new RegExp(`(^|[^a-z0-9])${token}(?=[^a-z0-9]|$)`, "i").test(hostname);
}

function isPrivateOrLocalHost(hostname) {
  const host = hostname.replace(/^\\[|\\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host === "::1") {
    return true;
  }

  if (!isIpv4(host)) return false;
  const [a, b] = host.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168);
}

function detectBrandImpersonation(hostname) {
  return BRAND_DOMAIN_POLICIES.find((policy) =>
    hostnameContainsBrandToken(hostname, policy.token) &&
    !policy.domains.some((domain) => hostnameMatchesDomain(hostname, domain))
  );
}

const isIpv4 = (hostname) => {
  const parts = hostname.split(".");
  return parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
};

function analyzeUrl(input) {
  const value = String(input || "").trim();
  if (!value) throw Object.assign(new Error("URL is required"), { status: 400 });
  if (value.length > 2048) throw Object.assign(new Error("URL is too long"), { status: 400 });

  let parsed;
  try { parsed = new URL(value); }
  catch { throw Object.assign(new Error("Please enter a complete valid URL, including https://"), { status: 400 }); }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw Object.assign(new Error("Only HTTP and HTTPS URLs are supported"), { status: 400 });
  }

  const indicators = [];
  const add = (item) => { if (!indicators.includes(item)) indicators.push(item); };
  const hostname = parsed.hostname.toLowerCase();
  const pathAndQuery = (parsed.pathname + parsed.search).toLowerCase();

  if (parsed.protocol === "http:") add("Uses HTTP instead of HTTPS");
  if (isIpv4(hostname) || hostname.startsWith("[") && hostname.endsWith("]")) {
    add("Uses a direct IP address instead of a conventional public domain name");
  }
  if (isPrivateOrLocalHost(hostname)) {
    add("Points to a local or private-network host; this scanner does not connect to the destination");
  }
  if (hostname.includes("xn--")) add("Uses an internationalized/punycode hostname that needs extra verification");
  if (parsed.username || parsed.password) add("Contains embedded user information before the host");
  if (SHORTENER_HOSTS.has(hostname)) add("Uses a URL-shortening service, so the final destination is hidden");
  if ([...SUSPICIOUS_TLDS].some((suffix) => hostname.endsWith(suffix))) add("Uses a domain ending that deserves extra verification");
  if (hostname.split(".").length >= 5) add("Uses an unusually deep subdomain structure");
  if (/login|verify|account|secure|update|kyc|payment|wallet|bank|gift|prize|claim|support/.test(pathAndQuery)) add("URL path contains a high-pressure or account/payment keyword");

  const impersonatedBrand = detectBrandImpersonation(hostname);
  if (impersonatedBrand) {
    add(`Hostname contains the ${impersonatedBrand.brand} name but does not match a recognized ${impersonatedBrand.brand} domain`);
  }

  // No structural warning is not a positive safety verdict. UNKNOWN is intentional.
  let riskLevel = "UNKNOWN";
  if (indicators.length >= 3) riskLevel = "HIGH";
  else if (indicators.length >= 1) riskLevel = "MEDIUM";

  return {
    input: value,
    normalizedUrl: parsed.toString(),
    hostname,
    protocol: parsed.protocol.replace(":", ""),
    riskLevel,
    confidence: indicators.length ? Math.min(0.9, 0.5 + indicators.length * 0.08) : 0.35,
    indicators,
    explanation: indicators.length
      ? "The URL has observable characteristics that deserve caution. These signals are not proof that the destination is malicious."
      : "No obvious structural warning signs were detected. A clean-looking URL is not proof that a site is trustworthy.",
    recommendedActions: [
      "Do not sign in, pay, download files, or share sensitive information until the destination is independently verified.",
      "Open the organisation's official website or app yourself instead of relying on the suspicious link.",
      "If the link came from an unexpected message, preserve the message as evidence if you may need to report it.",
    ],
    analysisMethod: "CyberRakshak deterministic URL structure analysis",
    evidenceStatus: "STRUCTURAL_ONLY",
  };
}

module.exports = { analyzeUrl };
