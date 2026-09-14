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
    pattern.lastIndex = 0;
    result = result.replace(pattern, "[REDACTED SENSITIVE DATA]");
  }
  return result.slice(0, MAX_CONTEXT_LENGTH);
};

const sanitizeUrlsForAI = (value) => String(value || "").replace(/\bhttps?:\/\/[^\s]+/gi, (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return rawUrl.replace(/[?#].*$/, "");
  }
});

const sanitizeUserContent = (value) => sanitizeUrlsForAI(redactSensitiveData(value));

const buildSafetyPrompt = ({ text, inputType, assessment }) => {
  const safeText = sanitizeUserContent(text);
  const safeAssessment = JSON.stringify({
    riskLevel: assessment?.riskLevel || "info",
    score: Number(assessment?.score) || 0,
    reasons: Array.isArray(assessment?.reasons) ? assessment.reasons.slice(0, 8) : [],
    indicators: Array.isArray(assessment?.indicators)
      ? assessment.indicators.slice(0, 12).map((indicator) => ({
          type: indicator?.type || null,
          value: indicator?.type === "url" || indicator?.type === "domain" ? "[REDACTED INDICATOR VALUE]" : "[REDACTED INDICATOR VALUE]",
        }))
      : [],
    evidence: Array.isArray(assessment?.evidence)
      ? assessment.evidence.slice(0, 6).map(({ threatId, title, severity, matchedIndicators, matchedSignals, sourceReferences }) => ({
          threatId,
          title,
          severity,
          matchedIndicatorCount: Array.isArray(matchedIndicators) ? matchedIndicators.length : 0,
          matchedSignalCount: Array.isArray(matchedSignals) ? matchedSignals.length : 0,
          sourceReferences: Array.isArray(sourceReferences) ? sourceReferences.slice(0, 5) : [],
        }))
      : [],
  });

  return [
    "You are CyberRakshak, a defensive cyber-safety assistant.",
    "Explain risk clearly to a general Indian user. Never ask for or expose passwords, OTPs, PINs, CVVs, private keys, full payment-card numbers, authentication codes, or other secrets.",
    "The deterministic assessment is authoritative for riskLevel and score. You may explain or contextualize it, but you MUST NOT change, override, downgrade, or upgrade that decision.",
    "Threat category or keyword matches alone are not proof. State uncertainty when evidence is incomplete, conflicting, or indirect.",
    "Use only the supplied deterministic evidence and user content. Do not invent threat names, facts, official actions, phone numbers, reporting links, or URLs.",
    "Give practical, non-destructive next steps. For a suspected scam, advise the user not to click, pay, install, or share sensitive information.",
    "If the user may already have paid or shared credentials, prioritize contacting the relevant bank/service and official cybercrime reporting channels without inventing contact details.",
    "Return concise JSON with keys: summary, whyRisky, safeNextSteps, confidenceNote.",
    "inputType: " + String(inputType || "text"),
    "userContent: " + safeText,
    "deterministicAssessment: " + safeAssessment,
  ].join("\n");
};

module.exports = { buildSafetyPrompt, redactSensitiveData, sanitizeUserContent };
