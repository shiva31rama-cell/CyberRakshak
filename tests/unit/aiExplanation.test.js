const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSafetyPrompt, redactSensitiveData, sanitizeUserContent } = require("../../services/ai/safetyPrompt");
const { fallbackExplanation } = require("../../services/ai/explanationService");

test("redacts common secrets before AI processing", () => {
  const result = redactSensitiveData("OTP: 123456, PIN: 4321, card 4111 1111 1111 1111");
  assert.equal(result.includes("123456"), false);
  assert.equal(result.includes("4321"), false);
  assert.equal(result.includes("4111 1111 1111 1111"), false);
  assert.equal((result.match(/REDACTED SENSITIVE DATA/g) || []).length, 3);
});

test("removes URL query and fragment data before AI processing", () => {
  const result = sanitizeUserContent("Visit https://example.com/login?session=private-value#account");
  assert.equal(result.includes("session=private-value"), false);
  assert.equal(result.includes("#account"), false);
  assert.equal(result.includes("https://example.com/login"), true);
});

test("prompt preserves deterministic evidence metadata without exposing indicator values", () => {
  const prompt = buildSafetyPrompt({
    text: "Urgent account verification",
    inputType: "message",
    assessment: {
      riskLevel: "high",
      score: 72,
      reasons: ["Urgency"],
      indicators: [{ type: "url", value: "https://example.invalid/path" }],
      evidence: [{
        threatId: "T-001",
        title: "Credential phishing",
        severity: "high",
        matchedIndicators: [{ type: "url", value: "https://example.invalid/path" }],
        matchedSignals: ["urgent"],
        sourceReferences: ["cert-in"],
      }],
    },
  });
  assert.match(prompt, /deterministicAssessment/);
  assert.match(prompt, /MUST NOT change, override, downgrade, or upgrade/);
  assert.match(prompt, /matchedIndicatorCount/);
  assert.match(prompt, /matchedSignalCount/);
  assert.match(prompt, /sourceReferences/);
  assert.equal(prompt.includes("https://example.invalid/path"), false);
});

test("fallback explanation is safe and actionable", () => {
  const result = fallbackExplanation({ riskLevel: "high", reasons: ["Suspicious urgency"] });
  assert.equal(result.mode, "deterministic-fallback");
  assert.ok(result.summary.length > 0);
  assert.ok(result.safeNextSteps.length >= 3);
});
