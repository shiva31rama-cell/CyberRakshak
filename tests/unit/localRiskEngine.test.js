const test = require("node:test");
const assert = require("node:assert/strict");

const {
  analyzeText,
  normalizeInput,
  calculateRiskLevel,
} = require("../../services/risk-engine/localRiskEngine");

test("normalizes whitespace", () => {
  assert.equal(normalizeInput("  hello   world  "), "hello world");
});

test("maps risk scores", () => {
  assert.equal(calculateRiskLevel(0), "info");
  assert.equal(calculateRiskLevel(20), "low");
  assert.equal(calculateRiskLevel(30), "medium");
  assert.equal(calculateRiskLevel(50), "high");
  assert.equal(calculateRiskLevel(80), "critical");
});

test("detects OTP pressure", () => {
  const result = analyzeText("Send the OTP immediately to verify your account.");
  assert.ok(result.score > 0);
  assert.ok(result.categories.includes("social_engineering"));
});

test("detects UPI PIN requests", () => {
  const result = analyzeText("Provide your UPI PIN to complete verification.");
  assert.ok(result.categories.includes("upi_fraud"));
  assert.ok(result.score >= 35);
});

test("detects malicious-app installation pressure", () => {
  const result = analyzeText("Install this APK immediately to receive your refund.");
  assert.ok(result.categories.includes("malicious_app"));
  assert.ok(result.score >= 30);
});

test("detects suspicious attachments", () => {
  const result = analyzeText("Open this unexpected attachment from the account.");
  assert.ok(result.categories.includes("malicious_attachment"));
});

test("detects remote-access pressure", () => {
  const result = analyzeText("Share your screen so our support team can fix the issue.");
  assert.ok(result.categories.includes("remote_access_scam"));
});

test("extracts links", () => {
  const result = analyzeText("Click here immediately: https://example.test/login");
  assert.ok(result.categories.includes("malicious_link"));
  assert.equal(result.indicators[0].type, "url");
});

test("does not mark ordinary conversation as high or critical", () => {
  const result = analyzeText("Hello, are we still meeting tomorrow at 10 AM?");
  assert.notEqual(result.riskLevel, "high");
  assert.notEqual(result.riskLevel, "critical");
});

test("handles empty input", () => {
  const result = analyzeText("");
  assert.equal(result.riskLevel, "unknown");
  assert.equal(result.score, 0);
});
