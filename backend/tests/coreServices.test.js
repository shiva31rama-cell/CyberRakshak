const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeUrl } = require("../services/analysis/urlAnalysisService");
const { buildIncidentPlan } = require("../services/incident/incidentService");
const { verifySocialClaim } = require("../services/verification/socialVerificationService");

test("URL scanner rejects malformed input", () => {
  assert.throws(() => analyzeUrl("not-a-url"), /valid URL/i);
});

test("URL scanner returns cautious risk for suspicious characteristics", () => {
  const result = analyzeUrl("http://example.com/login?verify=account");
  assert.ok(["LOW", "MEDIUM", "HIGH"].includes(result.riskLevel));
  assert.ok(result.indicators.length >= 1);
  assert.match(result.explanation, /does not prove/i);
});

test("incident plan never requests secrets", () => {
  const result = buildIncidentPlan("financial_fraud", "money lost");
  assert.ok(result.neverShare.includes("OTP or one-time code"));
  assert.ok(!JSON.stringify(result).toLowerCase().includes("send your otp"));
});

test("social verification keeps unverified distinct from false", () => {
  const result = verifySocialClaim("This government scheme is 100% guaranteed.");
  assert.equal(result.verdict, "Needs verification");
  assert.match(result.explanation, /Unverified does not mean false|checked/i);
});
