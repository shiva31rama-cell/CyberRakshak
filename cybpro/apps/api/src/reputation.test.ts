import test from "node:test";
import assert from "node:assert/strict";
import { checkUrlReputation } from "./reputation.js";

test("does not call a provider when no API key is configured", async () => {
  const result = await checkUrlReputation("https://example.com", { apiKey: "" });
  assert.equal(result.status, "not_configured");
  assert.equal(result.source, null);
});

test("does not send private or local addresses to an external provider", async () => {
  let called = false;
  const result = await checkUrlReputation("http://192.168.1.10/login", {
    apiKey: "test-key",
    fetchImpl: (async () => { called = true; throw new Error("should not be called"); }) as typeof fetch
  });
  assert.equal(result.status, "not_checked_private_address");
  assert.equal(called, false);
});

test("reports a provider match and its threat type", async () => {
  let requestedEndpoint = "";
  const result = await checkUrlReputation("https://example.com/path", {
    apiKey: "test-key",
    fetchImpl: (async (input: RequestInfo | URL) => {
      requestedEndpoint = String(input);
      return new Response(JSON.stringify({ matches: [{ threatType: "SOCIAL_ENGINEERING" }] }), {
        status: 200, headers: { "content-type": "application/json" }
      });
    }) as typeof fetch
  });
  assert.equal(result.status, "checked");
  assert.deepEqual(result.matches, ["SOCIAL_ENGINEERING"]);
  assert.match(requestedEndpoint, /safebrowsing\.googleapis\.com/);
  assert.ok(result.checkedAt);
});

test("returns an explicit unavailable state when the provider fails", async () => {
  const result = await checkUrlReputation("https://example.com", {
    apiKey: "test-key",
    fetchImpl: (async () => new Response("rate limited", { status: 429 })) as typeof fetch
  });
  assert.equal(result.status, "unavailable");
  assert.match(result.detail, /rate limit/i);
});
