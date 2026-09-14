const test = require("node:test");
const assert = require("node:assert/strict");
const { searchThreats, getThreatById } = require("../../services/threat-intelligence/threatIntelligenceEngine");

test("returns a structured threat feed without query text", () => {
  const results = searchThreats({ limit: 5 });
  assert.ok(Array.isArray(results));
  assert.ok(results.length > 0);
  assert.ok(results.every((item) => item.threatId && item.severity && item.category && item.description && Array.isArray(item.sources)));
});

test("matches threat intelligence from textual indicators", () => {
  const results = searchThreats({ text: "WhatsApp attachment malware", limit: 5 });
  assert.ok(results.length > 0);
  assert.ok(results.some((item) => item.relevance > 0));
});

test("keeps inline official sources visible", () => {
  const threat = getThreatById("cert-in-whatsapp-attachments-2026");
  assert.ok(threat);
  assert.equal(threat.sources.length, 1);
  assert.equal(threat.sources[0].name, "CERT-In");
  assert.equal(threat.sources[0].verified, true);
  assert.equal(threat.sources[0].tier, "authoritative");
});

test("returns null for an unknown threat", () => {
  assert.equal(getThreatById("does-not-exist"), null);
});
