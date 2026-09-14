const assert = require("node:assert/strict");
const test = require("node:test");
const { calculateSourceConfidence, rankSources } = require("../../services/threat-intelligence/sourceTrust");

test("authoritative verified sources rank above community sources", () => {
  const sources = rankSources([
    { id: "community", tier: "community", verified: false },
    { id: "official", tier: "authoritative", verified: true, publishedAt: "2026-09-01", retrievedAt: "2026-09-14" },
  ]);

  assert.equal(sources[0].id, "official");
  assert.ok(sources[0].confidence > sources[1].confidence);
});

test("source confidence stays within 0 to 100", () => {
  const confidence = calculateSourceConfidence({ tier: "authoritative", verified: true, publishedAt: "2026-09-01", retrievedAt: "2026-09-14" });
  assert.ok(confidence >= 0 && confidence <= 100);
});
