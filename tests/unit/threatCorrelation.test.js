const test = require("node:test");
const assert = require("node:assert/strict");
const { correlateThreats, indicatorMatches, signalMatches } = require("../../services/risk-engine/threatCorrelation");

const source = {
  id: "test-certin",
  name: "CERT-In test source",
  tier: "authoritative",
  verified: true,
  publishedAt: "2026-09-01T00:00:00Z",
  retrievedAt: "2026-09-14T00:00:00Z",
};

test("matches exact URL indicators", () => {
  const result = indicatorMatches(
    [{ type: "url", value: "https://example.test/pay" }],
    [{ type: "url", value: "https://example.test/pay" }],
  );
  assert.equal(result.length, 1);
});

test("normalizes a trailing slash for URL comparison", () => {
  const result = indicatorMatches(
    [{ type: "url", value: "https://example.test/pay/" }],
    [{ type: "url", value: "https://example.test/pay" }],
  );
  assert.equal(result.length, 1);
});

test("does not match different indicator types when both are explicit", () => {
  const result = indicatorMatches(
    [{ type: "email", value: "example.test" }],
    [{ type: "domain", value: "example.test" }],
  );
  assert.equal(result.length, 0);
});

test("matches behavioral signals conservatively", () => {
  const result = signalMatches(
    "Your account will be blocked unless you verify your account immediately",
    ["verify your account"],
  );
  assert.deepEqual(result, ["verify your account"]);
});

test("does not create evidence from category alone", () => {
  const result = correlateThreats({
    text: "hello friend",
    categories: ["phishing"],
    threats: [{ id: "t1", title: "Phishing", category: "phishing", severity: "high" }],
  });
  assert.deepEqual(result, []);
});

test("correlation preserves authoritative source confidence", () => {
  const [result] = correlateThreats({
    text: "Please verify your account immediately",
    categories: ["phishing"],
    threats: [{
      id: "phishing-test",
      title: "Account verification phishing",
      category: "phishing",
      severity: "high",
      keywords: ["verify your account"],
      sources: [source],
    }],
  });
  assert.equal(result.threatId, "phishing-test");
  assert.equal(result.categoryMatched, true);
  assert.ok(result.confidence >= 70);
  assert.equal(result.sources[0].tierRank, 1);
});

test("does not create evidence for unrelated content", () => {
  const result = correlateThreats({
    text: "The library closes at six today.",
    threats: [{
      id: "upi-test",
      title: "UPI collect request scam",
      category: "upi_fraud",
      severity: "high",
      keywords: ["collect request", "send money"],
    }],
  });
  assert.equal(result.length, 0);
});

test("returns evidence with both indicator and signal matches", () => {
  const result = correlateThreats({
    text: "Install this APK now and send money",
    indicators: [{ type: "url", value: "https://example.test/app.apk" }],
    categories: ["malicious_app", "payment_fraud"],
    threats: [{
      id: "apk-test",
      title: "Malicious APK delivery",
      category: "malicious_app",
      severity: "critical",
      indicators: [{ type: "url", value: "https://example.test/app.apk" }],
      keywords: ["install this APK"],
    }],
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].matchedIndicators.length, 1);
  assert.equal(result[0].matchedSignals.length, 1);
  assert.equal(result[0].categoryMatched, true);
});
