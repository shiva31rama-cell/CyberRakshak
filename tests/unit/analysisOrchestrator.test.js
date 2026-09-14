const test = require("node:test");
const assert = require("node:assert/strict");

const { analyze } = require("../../services/risk-engine/analysisOrchestrator");
const { extractIndicators } = require("../../services/risk-engine/indicatorExtractor");

 test("extracts URL, email and phone indicators", () => {
  const result = extractIndicators(
    "Visit https://example.test and contact help@example.test or 9876543210",
  );

  assert.ok(result.some((item) => item.type === "url"));
  assert.ok(result.some((item) => item.type === "email"));
  assert.ok(result.some((item) => item.type === "phone"));
});

test("orchestrates local analysis into one result", () => {
  const result = analyze({
    text: "Urgent: send your OTP immediately to verify your account.",
  });

  assert.ok(result.score > 0);
  assert.ok(["low", "medium", "high", "critical"].includes(result.riskLevel));
  assert.ok(Array.isArray(result.indicators));
  assert.ok(Array.isArray(result.evidence));
  assert.ok(Array.isArray(result.sourceReferences));
});

test("keeps empty input safe and explainable", () => {
  const result = analyze({ text: "" });

  assert.equal(result.riskLevel, "unknown");
  assert.equal(result.score, 0);
  assert.deepEqual(result.indicators, []);
});
