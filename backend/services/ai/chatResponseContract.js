const PROVIDERS = new Set([
  "AI",
  "CyberRakshak safety fallback",
  "CyberRakshak scope guard",
]);

const INTENTS = new Set(["greeting", "cyber_assistance", "non_cyber"]);
const TRIAGE_STAGES = new Set(["general", "identify_assess", "contain", "recover_report"]);
const INCIDENT_TYPES = new Set([
  "financial_fraud",
  "phishing",
  "account_compromise",
  "device_compromise",
  "malware",
  "impersonation",
  "privacy",
  "cyberbullying",
]);

const MAX_REPLY_LENGTH = 8000;
const MAX_SOURCES = 10;
const MAX_SOURCE_LABEL_LENGTH = 160;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSource(source) {
  if (!isPlainObject(source)) return false;
  if (typeof source.label !== "string" || !source.label.trim() || source.label.length > MAX_SOURCE_LABEL_LENGTH) {
    return false;
  }
  if (typeof source.url !== "string" || source.url.length > 2048) return false;

  try {
    const url = new URL(source.url);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

/**
 * Validates the complete JSON shape returned by POST /api/chat.
 * This validates response structure and trusted source metadata, not the truth of
 * the model's natural-language claims. Content still needs grounding and review.
 */
function validateChatResponse(value) {
  const errors = [];
  if (!isPlainObject(value)) {
    return { valid: false, errors: ["response must be an object"] };
  }

  if (value.success !== true) errors.push("success must be true");
  if (typeof value.reply !== "string" || !value.reply.trim() || value.reply.length > MAX_REPLY_LENGTH) {
    errors.push("reply must be a non-empty string of at most 8000 characters");
  }
  if (!PROVIDERS.has(value.provider)) errors.push("provider is not an allowed provider label");
  if (!INTENTS.has(value.intent)) errors.push("intent is not an allowed value");
  if (value.incidentType !== null && !INCIDENT_TYPES.has(value.incidentType)) {
    errors.push("incidentType is not an allowed category or null");
  }
  if (!TRIAGE_STAGES.has(value.triageStage)) errors.push("triageStage is not an allowed value");
  if (!Array.isArray(value.sources) || value.sources.length > MAX_SOURCES) {
    errors.push("sources must be an array of at most 10 trusted source entries");
  } else if (!value.sources.every(validateSource)) {
    errors.push("each source must have a bounded label and a credential-free HTTPS URL");
  }

  if (errors.length) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    data: {
      success: true,
      reply: value.reply.trim(),
      provider: value.provider,
      intent: value.intent,
      incidentType: value.incidentType,
      triageStage: value.triageStage,
      sources: value.sources.map((source) => ({
        label: source.label.trim(),
        url: source.url,
      })),
    },
  };
}

module.exports = { validateChatResponse };
