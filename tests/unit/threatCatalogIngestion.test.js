const test = require("node:test");
const assert = require("node:assert/strict");
const { getAllThreats, searchThreats } = require("../../services/risk-engine/threatCatalog");

test("loads curated and nested intelligence records", () => {
  const threats = getAllThreats();
  assert.ok(threats.length > 0);
  assert.equal(threats.every((item) => item.id && item.title), true);
});

test("does not return empty-query matches", () => {
  assert.deepEqual(searchThreats(""), []);
});
