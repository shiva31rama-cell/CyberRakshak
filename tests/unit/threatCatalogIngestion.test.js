const { getAllThreats, searchThreats } = require("../../services/risk-engine/threatCatalog");

describe("threat catalog ingestion", () => {
  test("loads curated and nested intelligence records", () => {
    const threats = getAllThreats();
    expect(threats.length).toBeGreaterThan(0);
    expect(threats.every((item) => item.id && item.title)).toBe(true);
  });

  test("does not return empty-query matches", () => {
    expect(searchThreats("")).toEqual([]);
  });
});
