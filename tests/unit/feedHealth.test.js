const { createFeedResult, summarizeFeedHealth } = require("../../services/threat-intelligence/feedHealth");

describe("threat feed health", () => {
  const feed = { id: "demo", sourceId: "cert-in" };

  test("creates a normalized feed result", () => {
    const result = createFeedResult({ feed, status: "healthy", records: 12 });
    expect(result).toMatchObject({ feedId: "demo", sourceId: "cert-in", status: "healthy", records: 12 });
    expect(result.retrievedAt).toBeTruthy();
  });

  test("summarizes healthy and failed feeds", () => {
    expect(summarizeFeedHealth([
      { status: "healthy" },
      { status: "healthy" },
      { status: "failed" },
    ])).toEqual({ total: 3, healthy: 2, degraded: 0, failed: 1, healthPercent: 67 });
  });
});
