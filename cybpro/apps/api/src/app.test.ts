import test from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "./app.js";

test("health endpoint returns service identity and reputation configuration", async () => {
  const app = await buildApp({ logger: false });
  try {
    const response = await app.inject({ method: "GET", url: "/api/v1/health" });
    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.equal(body.status, "ok");
    assert.equal(body.product, "CYBPRO");
    assert.equal(body.stage, "early-preview");
    assert.ok(["configured", "not_configured"].includes(body.urlReputation));
  } finally {
    await app.close();
  }
});

test("text endpoint returns the documented report contract", async () => {
  const app = await buildApp({ logger: false });
  try {
    const response = await app.inject({
      method: "POST", url: "/api/v1/analyze/text",
      payload: { content: "URGENT: share your OTP to claim a reward" }
    });
    assert.equal(response.statusCode, 200);
    const report = response.json();
    assert.equal(report.status, "rule_based_preview");
    assert.equal(report.confidence, "limited");
    assert.ok(Array.isArray(report.indicators));
    assert.ok(Array.isArray(report.guidance));
    assert.match(report.caveat, /not a verdict/i);
  } finally {
    await app.close();
  }
});

test("URL endpoint reports local traits and explicitly says when reputation is not configured", async () => {
  const originalKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  delete process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  const app = await buildApp({ logger: false });
  try {
    const response = await app.inject({
      method: "POST", url: "/api/v1/analyze/url",
      payload: { url: "http://bit.ly:8080/test" }
    });
    assert.equal(response.statusCode, 200);
    const report = response.json();
    assert.ok(report.indicators.includes("Known URL-shortening domain hides the final destination"));
    assert.equal(report.reputation.status, "not_configured");
    assert.match(report.caveat, /not configured/i);
  } finally {
    await app.close();
    if (originalKey === undefined) delete process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    else process.env.GOOGLE_SAFE_BROWSING_API_KEY = originalKey;
  }
});

test("invalid and unexpected payload fields are rejected", async () => {
  const app = await buildApp({ logger: false });
  try {
    const emptyText = await app.inject({ method: "POST", url: "/api/v1/analyze/text", payload: { content: "  " } });
    const extraField = await app.inject({ method: "POST", url: "/api/v1/analyze/url", payload: { url: "https://example.com", secret: "unexpected" } });
    assert.equal(emptyText.statusCode, 400);
    assert.equal(extraField.statusCode, 400);
  } finally {
    await app.close();
  }
});
