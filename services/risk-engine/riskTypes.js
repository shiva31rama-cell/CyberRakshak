const RISK_LEVELS = Object.freeze([
  "critical",
  "high",
  "medium",
  "low",
  "info",
  "unknown",
]);

const INPUT_TYPES = Object.freeze([
  "text",
  "url",
  "phone",
  "email",
  "upi",
  "qr",
  "image",
  "document",
  "notification",
  "app",
  "incident",
]);

const THREAT_CATEGORIES = Object.freeze([
  "phishing",
  "smishing",
  "vishing",
  "upi_fraud",
  "payment_fraud",
  "identity_impersonation",
  "account_takeover",
  "malicious_app",
  "malicious_link",
  "qr_fraud",
  "investment_fraud",
  "job_fraud",
  "shopping_fraud",
  "romance_scam",
  "deepfake_impersonation",
  "social_engineering",
  "data_theft",
  "privacy",
  "unknown",
]);

const SOURCE_TYPES = Object.freeze([
  "government",
  "regulator",
  "official_vendor",
  "academic",
  "security_research",
  "reputable_media",
  "official_social",
  "public_repository",
  "community",
]);

const VERIFICATION_STATES = Object.freeze([
  "verified",
  "partially_verified",
  "unverified",
  "deprecated",
]);

const createEmptyAssessment = () => ({
  riskLevel: "unknown",
  score: 0,
  confidence: 0,
  inputType: "text",
  categories: [],
  indicators: [],
  reasons: [],
  recommendedActions: [],
  sourceReferences: [],
  analyzedAt: new Date().toISOString(),
});

const isRiskLevel = (value) => RISK_LEVELS.includes(value);
const isInputType = (value) => INPUT_TYPES.includes(value);
const isThreatCategory = (value) => THREAT_CATEGORIES.includes(value);
const isSourceType = (value) => SOURCE_TYPES.includes(value);
const isVerificationState = (value) => VERIFICATION_STATES.includes(value);

module.exports = {
  RISK_LEVELS,
  INPUT_TYPES,
  THREAT_CATEGORIES,
  SOURCE_TYPES,
  VERIFICATION_STATES,
  createEmptyAssessment,
  isRiskLevel,
  isInputType,
  isThreatCategory,
  isSourceType,
  isVerificationState,
};
