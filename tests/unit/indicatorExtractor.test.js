const test = require("node:test");
const assert = require("node:assert/strict");

const { extractIndicators } = require("../../services/risk-engine/indicatorExtractor");

test("extracts domains from URLs and standalone text", () => {
  const result = extractIndicators("Open https://example.com/path and review secure.example.org");

  assert.ok(result.some((item) => item.type === "url" && item.value === "https://example.com/path"));
  assert.ok(result.some((item) => item.type === "domain" && item.value === "example.com"));
  assert.ok(result.some((item) => item.type === "domain" && item.value === "secure.example.org"));
});

test("extracts UPI IDs without classifying them as email", () => {
  const result = extractIndicators("Pay to rama123@upi and contact help@example.com");

  assert.ok(result.some((item) => item.type === "upi" && item.value === "rama123@upi"));
  assert.ok(result.some((item) => item.type === "email" && item.value === "help@example.com"));
  assert.equal(result.some((item) => item.type === "upi" && item.value === "help@example.com"), false);
});

test("extracts common cryptographic hash formats", () => {
  const result = extractIndicators(
    "md5 0123456789abcdef0123456789abcdef sha1 0123456789abcdef0123456789abcdef01234567",
  );

  assert.ok(result.some((item) => item.type === "hash" && item.algorithm === "md5"));
  assert.ok(result.some((item) => item.type === "hash" && item.algorithm === "sha1"));
});

test("normalizes Indian phone numbers", () => {
  const result = extractIndicators("Call +91 98765-43210 or 9123456789");

  assert.ok(result.some((item) => item.type === "phone" && item.value === "+919876543210"));
  assert.ok(result.some((item) => item.type === "phone" && item.value === "9123456789"));
});
