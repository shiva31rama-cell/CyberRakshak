const URL_RULES = [
  { pattern: /https?:\/\/[^\s]+/i, label: "Uses a web URL" },
  { pattern: /@/i, label: "Contains an @ symbol that can make a URL confusing" },
  { pattern: /xn--/i, label: "Contains an internationalized/punycode hostname" },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl/i, label: "Uses a URL-shortening service" },
  { pattern: /login|verify|kyc|account|payment|wallet|bank/i, label: "URL text contains a sensitive-action keyword" },
];

function analyzeUrl(input) {
  const value = String(input || "").trim();
  if (!value) throw Object.assign(new Error("URL is required"), { status: 400 });
  if (value.length > 2048) throw Object.assign(new Error("URL is too long"), { status: 400 });

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw Object.assign(new Error("Please enter a complete valid URL, including https://"), { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw Object.assign(new Error("Only HTTP and HTTPS URLs are supported"), { status: 400 });
  }

  const indicators = [];
  for (const rule of URL_RULES) if (rule.pattern.test(value) && !indicators.includes(rule.label)) indicators.push(rule.label);

  if (parsed.protocol !== "https:") indicators.push("Connection is not HTTPS");
  if (parsed.hostname.split(".").length > 4) indicators.push("Hostname has an unusually deep subdomain structure");

  let riskLevel = "LOW";
  if (indicators.length >= 3) riskLevel = "HIGH";
  else if (indicators.length >= 1) riskLevel = "MEDIUM";

  return {
    url: parsed.toString(),
    riskLevel,
    confidence: indicators.length ? 0.62 : 0.48,
    indicators,
    explanation: indicators.length
      ? "The URL has observable characteristics that deserve caution. This check does not prove that the website is malicious."
      : "No strong risk indicators were found by the current URL heuristics. A clean heuristic result is not proof that a site is safe.",
    recommendedActions: [
      "Do not enter passwords, OTPs, PINs, CVVs or recovery codes unless you intentionally opened the official service.",
      "For banking, payments or government services, open the official app or type the known official website yourself.",
      "If you are unsure, do not continue and verify the request through an independent trusted channel.",
    ],
    analysisMethod: "CyberRakshak deterministic URL heuristics",
  };
}

module.exports = { analyzeUrl };
