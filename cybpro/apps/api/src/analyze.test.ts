import test from "node:test";
import assert from "node:assert/strict";
import { analyzeText } from "./analyze.js";

test("flags several suspicious indicators without claiming certainty", () => {
  const report = analyzeText("URGENT: your bank account is blocked. Share OTP immediately and claim reward at https://example.invalid");
  assert.equal(report.risk, "elevated");
  assert.equal(report.confidence, "limited");
  assert.ok(report.indicators.length >= 3);
  assert.match(report.caveat, /not a verdict/i);
});

test("does not call content safe when no patterns match", () => {
  const report = analyzeText("Hello, see you tomorrow.");
  assert.equal(report.risk, "no_obvious_indicators");
  assert.match(report.caveat, /do not prove content is safe/i);
});

test("provides the same essential safe guidance for all inputs", () => {
  const report = analyzeText("Please send me a file.");
  assert.ok(report.guidance.some((item) => item.includes("OTP")));
});