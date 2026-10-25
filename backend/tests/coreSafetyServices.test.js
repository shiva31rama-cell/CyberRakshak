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


test("URL scanner flags a deceptive bank-like hostname without trusting a substring", () => {
  const spoofed = analyzeUrl("https://sbi.co.in.attacker.com/login");
  assert.ok(spoofed.indicators.some((item) => /SBI name|brand/i.test(item)));
  assert.equal(spoofed.riskLevel, "HIGH");
  assert.match(spoofed.explanation, /not proof/i);
});

test("URL scanner does not flag known SBI hostnames only for containing the brand", () => {
  const root = analyzeUrl("https://sbi.co.in");
  const subdomain = analyzeUrl("https://login.sbi.co.in");
  assert.equal(root.indicators.some((item) => /SBI name|brand/i.test(item)), false);
  assert.equal(subdomain.indicators.some((item) => /SBI name|brand/i.test(item)), false);
});

test("URL scanner flags SBI-like lookalike hostname", () => {
  const result = analyzeUrl("https://sbi-kyc-update.example.com");
  assert.ok(result.indicators.some((item) => /SBI name|brand/i.test(item)));
});

test("URL scanner does not label a clean-looking HTTPS URL as low-risk or safe", () => {
  const result = analyzeUrl("https://example.org");
  assert.equal(result.riskLevel, "UNKNOWN");
  assert.equal(result.indicators.length, 0);
  assert.match(result.explanation, /not proof|not a site is trustworthy/i);
});

test("URL scanner flags local destinations and does not connect to them", () => {
  const localhost = analyzeUrl("http://localhost:4000/login");
  const privateIp = analyzeUrl("https://192.168.1.20/account");
  assert.ok(localhost.indicators.some((item) => /local or private/i.test(item)));
  assert.ok(privateIp.indicators.some((item) => /local or private/i.test(item)));
});

test("URL scanner handles explicit ports and rejects malformed or unsupported URLs", () => {
  const result = analyzeUrl("https://sbi.co.in:8443/login");
  assert.equal(result.hostname, "sbi.co.in");
  assert.throws(() => analyzeUrl("https://"), /complete valid URL/i);
  assert.throws(() => analyzeUrl("javascript:alert(1)"), /Only HTTP and HTTPS/i);
});
