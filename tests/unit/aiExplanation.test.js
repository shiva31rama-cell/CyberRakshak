const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSafetyPrompt, redactSensitiveData } = require("../../services/ai/safetyPrompt");
const { fallbackExplanation } = require("../../services/ai/explanationService");

test("redacts common secrets before AI processing", () => {
  const result = redactSensitiveData("OTP: 123456, PIN: 4321, card 4111 1111 1111 1111");
  assert.equal(result.includes("123456"), false);
  assert.equal(result.includes("4321"), false);
  assert.equal(result.includes("4111 1111 1111 1111"), false);
  assert.equal((result.match(/REDACTED SENSITIVE DATA/g) || []).length, 3);
});

test("prompt includes deterministic assessment and safety constraints", () => {
  const prompt = buildSafetyPrompt({
    text: "Urgent account verification",
    inputType: "message",
    assessment: { riskLevel: "high", score: 72, reasons: ["Urgency"], indicators: [], evidence: [] },
  });
  assert.match(prompt, /deterministicAssessment/);
  assert.match(prompt, /Never ask for or expose passwords/);
  assert.match(prompt, /riskLevel/);
});

test("fallback explanation is safe and actionable", () => {
  const result = fallbackExplanation({ riskLevel: "high", reasons: ["Suspicious urgency"] });
  assert.equal(result.mode, "deterministic-fallback");
  assert.ok(result.summary.length > 0);
  assert.ok(result.safeNextSteps.length >= 3);
});
