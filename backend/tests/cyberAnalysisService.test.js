const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeMessage } = require("../services/analysis/cyberAnalysisService");

test("classifies a suspicious bank KYC link with observable indicators", () => {
  const result = analyzeMessage("Your bank account will be blocked today. Update KYC using https://example.com and pay Rs 10.");
  assert.equal(result.isCyberRelated, true);
  assert.equal(result.category, "phishing");
  assert.equal(result.riskLevel, "HIGH");
  assert.ok(result.indicators.length >= 3);
  assert.ok(result.recommendedActions.length > 0);
});

test("classifies a prize payment message without claiming certainty", () => {
  const result = analyzeMessage("Congratulations, you won a prize. Pay Rs 500 to claim your reward through this link.");
  assert.equal(result.category, "lottery_scam");
  assert.equal(result.riskLevel, "HIGH");
  assert.match(result.explanation, /not.*proof|warning signs/i);
});

test("rejects empty scanner input", () => {
  assert.throws(() => analyzeMessage(""), /Message is required/);
});
