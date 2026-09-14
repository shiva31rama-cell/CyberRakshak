const MAX_CONTEXT_LENGTH = 9000;

const SECRET_PATTERNS = [
  /\b(?:otp|one[- ]time password|verification code)\s*[:#-]?\s*\d{4,8}\b/gi,
  /\b(?:cvv|cvc|security code)\s*[:#-]?\s*\d{3,4}\b/gi,
  /\b(?:pin|upi pin|atm pin)\s*[:#-]?\s*\d{4,6}\b/gi,
  /\b(?:password|passcode)\s*[:#-]?\s*[^\s,.;]{4,}\b/gi,
  /\b(?:\d[ -]?){13,19}\b/g,
];

const redactSensitiveData = (value) => {
  let result = String(value || "");
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, "[REDACTED SENSITIVE DATA]");
  }
  return result.slice(0, MAX_CONTEXT_LENGTH);
};

const buildSafetyPrompt = ({ text, inputType, assessment }) => {
  const safeText = redactSensitiveData(text);
  const safeAssessment = JSON.stringify({
    riskLevel: assessment?.riskLevel || "info",
    score: Number(assessment?.score) || 0,
    reasons: Array.isArray(assessment?.reasons) ? assessment.reasons.slice(0, 8) : [],
    indicators: Array.isArray(assessment?.indicators) ? assessment.indicators.slice(0, 12) : [],
    evidence: Array.isArray(assessment?.evidence)
      ? assessment.evidence.slice(0, 6).map(({ threatId, title, severity, matches }) => ({
          threatId,
          title,
          severity,
          matches,
        }))
      : [],
  });

  return [
    "You are CyberRakshak, a defensive cyber-safety assistant.",
    "Explain risk clearly to a general Indian user. Never ask for or expose passwords, OTPs, PINs, CVVs, private keys, or full payment-card numbers.",
    "Treat the deterministic assessment as the primary safety signal. Do not claim certainty when evidence is incomplete.",
    "Do not invent facts, threat names, official actions, phone numbers, or URLs.",
    "Give practical, non-destructive next steps. For a suspected scam, advise the user not to click, pay, install, or share sensitive information.",
    "If the user may already have paid or shared credentials, prioritize contacting the relevant bank/service and official cybercrime reporting channels without inventing contact details.",
    "Return concise JSON with keys: summary, whyRisky, safeNextSteps, confidenceNote.",
    "inputType: " + String(inputType || "text"),
    "userContent: " + safeText,
    "deterministicAssessment: " + safeAssessment,
  ].join("\n");
};

module.exports = { buildSafetyPrompt, redactSensitiveData };
