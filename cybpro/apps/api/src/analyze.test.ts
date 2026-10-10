import test from "node:test";
import assert from "node:assert/strict";
import { analyzeText, analyzeUrl } from "./analyze.js";

test("flags several suspicious text indicators without claiming certainty", () => {
  const report = analyzeText("URGENT: your bank account is blocked. Share OTP immediately and claim reward at https://example.invalid");
  assert.equal(report.risk, "elevated");
  assert.equal(report.confidence, "limited");
  assert.ok(report.indicators.length >= 3);
  assert.match(report.caveat, /not a verdict/i);
});

test("does not call text safe when no patterns match", () => {
  const report = analyzeText("Hello, see you tomorrow.");
  assert.equal(report.risk, "no_obvious_indicators");
  assert.match(report.caveat, /do not prove content is safe/i);
});

test("provides the same essential safe guidance for all text inputs", () => {
  const report = analyzeText("Please send me a file.");
  assert.ok(report.guidance.some((item) => item.includes("OTP")));
});

test("reports observable URL traits without fetching the destination", () => {
  const report = analyzeUrl("http://bit.ly:8080/example");
  assert.ok(report.indicators.includes("Connection uses HTTP rather than HTTPS"));
  assert.ok(report.indicators.includes("Known URL-shortening domain hides the final destination"));
  assert.ok(report.indicators.includes("URL uses a non-default port"));
  assert.match(report.caveat, /destination was not contacted/i);
});

test("does not invent URL warning signs for a basic HTTPS URL", () => {
  const report = analyzeUrl("https://example.com/path");
  assert.deepEqual(report.indicators, []);
  assert.equal(report.risk, "no_obvious_indicators");
  assert.match(report.caveat, /not a verdict/i);
});

test("handles malformed URLs without throwing", () => {
  const report = analyzeUrl("this is not a URL");
  assert.ok(report.indicators.includes("URL could not be parsed as an absolute web address"));
});
