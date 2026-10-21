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

test("detects account-blocking urgency and a request to follow a link", () => {
  const report = analyzeText("Your bank account will be blocked today. Click this link immediately to update your details.");
  assert.ok(report.indicators.includes("Urgency or threat language"));
  assert.ok(report.indicators.includes("Request to open or follow a link"));
  assert.equal(report.risk, "some");
});

test("detects requests for OTP or verification credentials", () => {
  const report = analyzeText("Your account verification is pending. Reply with your OTP to avoid suspension.");
  assert.ok(report.indicators.includes("Credential or verification request"));
  assert.ok(report.indicators.includes("Urgency or threat language"));
});

test("detects links and impersonation language in a lure", () => {
  const report = analyzeText("Official support team: claim your cashback at https://example.invalid");
  assert.ok(report.indicators.includes("Impersonation language"));
  assert.ok(report.indicators.includes("Payment or reward lure"));
  assert.ok(report.indicators.includes("Link present in submitted text"));
});

test("does not call text safe when no patterns match", () => {
  const report = analyzeText("Hello, see you tomorrow.");
  assert.equal(report.risk, "no_obvious_indicators");
  assert.match(report.caveat, /do not prove content is safe/i);
});

test("ordinary class messages do not trigger the current configured rules", () => {
  const report = analyzeText("Hi, our class meeting is scheduled for 10 AM tomorrow. Please bring your notebook.");
  assert.deepEqual(report.indicators, []);
  assert.equal(report.risk, "no_obvious_indicators");
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
  assert.match(report.caveat, /does not contact the destination/i);
});

test("flags credential-bearing URLs and IP-address hosts", () => {
  const report = analyzeUrl("http://user:pass@192.168.1.2:8080/login");
  assert.ok(report.indicators.includes("URL contains embedded username or password fields"));
  assert.ok(report.indicators.includes("Destination is written as an IP address rather than a domain name"));
  assert.ok(report.indicators.includes("Connection uses HTTP rather than HTTPS"));
});

test("flags punycode and unusually deep hostnames", () => {
  const report = analyzeUrl("https://a.b.c.d.xn--e1afmkfd.example/path");
  assert.ok(report.indicators.includes("Hostname contains an internationalized/punycode label"));
  assert.ok(report.indicators.includes("Hostname has an unusually deep subdomain structure"));
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
