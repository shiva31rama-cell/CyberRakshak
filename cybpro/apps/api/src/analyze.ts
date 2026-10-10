export type Risk = "elevated" | "some" | "no_obvious_indicators";

export type AnalysisReport = {
  status: "rule_based_preview";
  risk: Risk;
  confidence: "limited";
  indicators: string[];
  guidance: string[];
  caveat: string;
};

const guidance = [
  "Do not share passwords, OTPs, UPI PINs, CVVs, or recovery codes.",
  "Do not use contact details or links supplied by a suspicious message; independently open the official app or website.",
  "If money may have been lost, contact your bank or payment provider through an independently verified channel and use official reporting options."
];

const textPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "Urgency or threat language", pattern: /\b(urgent|immediately|within\s+\d+\s+(minute|hour)|blocked|suspended|expire today|final warning)\b/i },
  { label: "Credential or verification request", pattern: /\b(otp|one[- ]time password|upi pin|cvv|password|recovery code|verify your identity)\b/i },
  { label: "Payment or reward lure", pattern: /\b(prize|won|reward|cashback|claim your|pay now|transfer money|processing fee)\b/i },
  { label: "Link present in submitted text", pattern: /https?:\/\/|www\./i },
  { label: "Impersonation language", pattern: /\b(bank support|customer care|government officer|account department|police officer)\b/i }
];

const urlShorteners = new Set(["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy"]);

function buildReport(indicators: string[], extraCaveat: string): AnalysisReport {
  const risk: Risk = indicators.length >= 3
    ? "elevated"
    : indicators.length > 0
      ? "some"
      : "no_obvious_indicators";

  return {
    status: "rule_based_preview",
    risk,
    confidence: "limited",
    indicators,
    guidance,
    caveat: `This is a basic rule-based signal check, not a verdict. Missing warning signs do not prove content is safe. ${extraCaveat}`
  };
}

export function analyzeText(content: string): AnalysisReport {
  const indicators = textPatterns.filter(({ pattern }) => pattern.test(content)).map(({ label }) => label);
  return buildReport(indicators, "No live reputation service or tested detection benchmark is connected.");
}

/**
 * Parse a submitted URL locally. This function never fetches or opens the URL.
 * The output describes observable URL traits, not the safety of the destination.
 */
export function analyzeUrl(input: string): AnalysisReport {
  const value = input.trim();
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return buildReport(["URL could not be parsed as an absolute web address"], "Submit a complete URL beginning with https:// or http://.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return buildReport(["Unsupported URL protocol"], "Only HTTP and HTTPS web addresses are analyzed.");
  }

  const indicators: string[] = [];
  const hostname = parsed.hostname.toLowerCase();

  if (parsed.protocol === "http:") indicators.push("Connection uses HTTP rather than HTTPS");
  if (parsed.username || parsed.password) indicators.push("URL contains embedded username or password fields");
  if (hostname.startsWith("xn--") || hostname.split(".").some((part) => part.startsWith("xn--"))) {
    indicators.push("Hostname contains an internationalized/punycode label");
  }
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith("[") && hostname.endsWith("]")) {
    indicators.push("Destination is written as an IP address rather than a domain name");
  }
  if (urlShorteners.has(hostname)) indicators.push("Known URL-shortening domain hides the final destination");
  if (hostname.split(".").filter(Boolean).length >= 5) indicators.push("Hostname has an unusually deep subdomain structure");
  if (parsed.port && !["80", "443"].includes(parsed.port)) indicators.push("URL uses a non-default port");
  if (parsed.hostname.length > 100) indicators.push("Hostname is unusually long");

  return buildReport(indicators, "The destination was not contacted and no domain reputation, redirect, certificate, or page-content check was performed.");
}
