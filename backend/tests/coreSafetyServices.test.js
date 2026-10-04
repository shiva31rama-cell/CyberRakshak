const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeMessage } = require("../services/analysis/cyberAnalysisService");
const { analyzeUrl } = require("../services/analysis/urlAnalysisService");
const { buildIncidentPlan } = require("../services/incident/incidentService");
const { verifySocialClaim } = require("../services/verification/socialVerificationService");

test("message scanner detects a suspicious bank message", () => {
  const result = analyzeMessage("Your bank account will be blocked today. Verify KYC at https://example.com and pay Rs 10.");
  assert.equal(result.isCyberRelated, true);
  assert.equal(result.category, "phishing");
  assert.ok(["MEDIUM", "HIGH"].includes(result.riskLevel));
  assert.ok(result.indicators.some((item) => /link/i.test(item)));
  assert.equal(result.evidenceStatus, "HEURISTIC_ONLY");
});

test("message scanner flags a pasted authentication secret without echoing it", () => {
  const result = analyzeMessage("Your OTP is 123456. Please share the OTP.");
  assert.equal(result.sensitiveDataDetected, true);
  assert.ok(result.recommendedActions.some((item) => /secret|official security/i.test(item)));
  assert.equal(result.input, undefined);
});

test("message scanner rejects empty input", () => {
  assert.throws(() => analyzeMessage(""), /Message is required/);
});

test("URL scanner gives cautious structural analysis", () => {
  const result = analyzeUrl("http://bit.ly/login-verify");
  assert.equal(result.protocol, "http");
  assert.equal(result.hostname, "bit.ly");
  assert.ok(result.indicators.length >= 2);
  assert.equal(result.evidenceStatus, "STRUCTURAL_ONLY");
  assert.match(result.explanation, /not proof/i);
});

test("URL scanner rejects unsupported schemes", () => {
  assert.throws(() => analyzeUrl("javascript:alert(1)"), /Only HTTP and HTTPS/);
});

test("incident assistant never includes secrets as requested input", () => {
  const result = buildIncidentPlan("financial_fraud", "Money was debited from my account.");
  assert.ok(result.safeActions.length > 0);
  assert.ok(result.neverShare.some((item) => /OTP/i.test(item)));
  assert.equal(result.help.helpline, "1930");
});

test("social verification keeps unsupported claims unverified", () => {
  const result = verifySocialClaim("Government officially confirmed 100% guaranteed prize money.");
  assert.ok(["Unverified", "Needs verification"].includes(result.verdict));
  assert.match(result.explanation, /evidence|verified|verification/i);
  assert.ok(result.officialSources.length >= 3);
  assert.match(result.limitation, /does not browse|real-time verification/i);
});
