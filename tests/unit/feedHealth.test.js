const test = require("node:test");
const assert = require("node:assert/strict");
const { createFeedResult, summarizeFeedHealth } = require("../../services/threat-intelligence/feedHealth");

test("creates a normalized feed result", () => {
  const feed = { id: "demo", sourceId: "cert-in" };
  const result = createFeedResult({ feed, status: "healthy", records: 12 });
  assert.deepEqual(
    { feedId: result.feedId, sourceId: result.sourceId, status: result.status, records: result.records },
    { feedId: "demo", sourceId: "cert-in", status: "healthy", records: 12 },
  );
  assert.ok(result.retrievedAt);
});

test("summarizes healthy and failed feeds", () => {
  assert.deepEqual(summarizeFeedHealth([
    { status: "healthy" },
    { status: "healthy" },
    { status: "failed" },
  ]), { total: 3, healthy: 2, degraded: 0, failed: 1, healthPercent: 67 });
});
