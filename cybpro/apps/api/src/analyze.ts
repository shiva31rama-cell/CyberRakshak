export type Risk = "elevated" | "some" | "no_obvious_indicators";

export type AnalysisReport = {
  status: "rule_based_preview";
  risk: Risk;
  confidence: "limited";
  indicators: string[];
  guidance: string[];
  caveat: string;
};

const patterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "Urgency or threat language", pattern: /\b(urgent|immediately|within\s+\d+\s+(minute|hour)|blocked|suspended|expire today)\b/i },
  { label: "Credential or verification request", pattern: /\b(otp|one[- ]time password|upi pin|cvv|password|recovery code)\b/i },
  { label: "Payment or reward lure", pattern: /\b(prize|won|reward|cashback|claim your|pay now|transfer money)\b/i },
  { label: "Link present in submitted text", pattern: /https?:\/\/|www\./i },
  { label: "Impersonation language", pattern: /\b(bank support|customer care|government officer|account department)\b/i }
];

export function analyzeText(content: string): AnalysisReport {
  const indicators = patterns.filter(({ pattern }) => pattern.test(content)).map(({ label }) => label);
  const risk: Risk = indicators.length >= 3
    ? "elevated"
    : indicators.length > 0
      ? "some"
      : "no_obvious_indicators";

  const guidance = [
    "Do not share passwords, OTPs, UPI PINs, CVVs, or recovery codes.",
    "Do not use contact details or links supplied by a suspicious message; independently open the official app or website.",
    "If money may have been lost, contact your bank or payment provider through an independently verified channel and use official reporting options."
  ];

  return {
    status: "rule_based_preview",
    risk,
    confidence: "limited",
    indicators,
    guidance,
    caveat: "This is a basic local pattern check, not a verdict. Missing warning signs do not prove content is safe; source reputation checks and a tested benchmark are not yet connected."
  };
}