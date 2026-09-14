const HIGH_RISK_PATTERNS = [
  {
    pattern: /\botp\b|\bone[-\s]?time password\b/i,
    reason: "The content requests or references an OTP.",
    category: "social_engineering",
    weight: 25,
  },
  {
    pattern: /\bupi pin\b|\bupipin\b/i,
    reason: "The content references a UPI PIN.",
    category: "upi_fraud",
    weight: 35,
  },
  {
    pattern: /\bcvv\b|\bcard verification value\b/i,
    reason: "The content requests or references card security information.",
    category: "payment_fraud",
    weight: 30,
  },
  {
    pattern: /\bpassword\b|\bpasscode\b|\blogin credentials\b/i,
    reason: "The content requests or references account credentials.",
    category: "account_takeover",
    weight: 25,
  },
  {
    pattern: /\bverify your account\b|\baccount will be blocked\b/i,
    reason: "The message uses an account-verification or blocking pressure tactic.",
    category: "phishing",
    weight: 20,
  },
  {
    pattern: /\bclick (here|this link)\b|\bopen this link\b/i,
    reason: "The message attempts to push the recipient toward a link.",
    category: "phishing",
    weight: 15,
  },
  {
    pattern: /\burgent\b|\bimmediately\b|\bwithin \d+\s*(minutes?|hours?)\b/i,
    reason: "The message uses urgency to pressure a decision.",
    category: "social_engineering",
    weight: 15,
  },
  {
    pattern: /\bpay now\b|\bsend money\b|\btransfer money\b/i,
    reason: "The content requests an immediate financial action.",
    category: "payment_fraud",
    weight: 20,
  },
];

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;
const MAX_INPUT_LENGTH = 12000;

const normalizeInput = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);

const calculateRiskLevel = (score) => {
  if (score >= 70) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  if (score > 0) return "low";
  return "info";
};

const unique = (items) => [...new Set(items)];

const analyzeText = (input, inputType = "text") => {
  const text = normalizeInput(input);
  const result = {
    riskLevel: "unknown",
    score: 0,
    confidence: 0,
    inputType,
    categories: [],
    indicators: [],
    reasons: [],
    recommendedActions: [],
    sourceReferences: [],
    analyzedAt: new Date().toISOString(),
  };

  if (!text) {
    result.reasons.push("No analyzable content was supplied.");
    return result;
  }

  let score = 0;
  const categories = [];
  const reasons = [];

  for (const rule of HIGH_RISK_PATTERNS) {
    if (!rule.pattern.test(text)) continue;
    score += rule.weight;
    categories.push(rule.category);
    reasons.push(rule.reason);
  }

  const urls = text.match(URL_PATTERN) || [];
  if (urls.length > 0) {
    result.indicators.push(...urls.map((url) => ({ type: "url", value: url })));
    score += Math.min(urls.length * 5, 15);
    categories.push("malicious_link");
    reasons.push("The content contains one or more links that should be independently verified.");
  }

  result.score = Math.min(score, 100);
  result.riskLevel = calculateRiskLevel(result.score);
  result.categories = unique(categories);
  result.reasons = unique(reasons);

  if (result.riskLevel === "critical") {
    result.recommendedActions = [
      "Do not send money or security codes.",
      "Do not open additional links or attachments.",
      "Verify the request through an independently sourced official channel.",
    ];
  } else if (result.riskLevel === "high") {
    result.recommendedActions = [
      "Pause before responding.",
      "Do not share passwords, OTPs, PINs, CVVs, or recovery codes.",
      "Verify the sender through an independent official channel.",
    ];
  } else if (result.riskLevel === "medium") {
    result.recommendedActions = [
      "Treat the request cautiously.",
      "Verify important claims independently before acting.",
    ];
  } else {
    result.recommendedActions = [
      "No strong fraud indicator was detected by the local rules.",
      "Continue normal caution with unknown senders and links.",
    ];
  }

  result.confidence =
    result.riskLevel === "info"
      ? 0.35
      : Math.min(0.35 + result.reasons.length * 0.1, 0.9);

  return result;
};

module.exports = {
  analyzeText,
  normalizeInput,
  calculateRiskLevel,
};
