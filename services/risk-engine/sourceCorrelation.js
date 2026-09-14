const { rankSources } = require("../threat-intelligence/sourceTrust");

const correlateSources = (sourceReferences = [], sourceRegistry = []) => {
  const registry = new Map(sourceRegistry.map((source) => [source.id, source]));
  const resolved = sourceReferences
    .map((id) => registry.get(id))
    .filter(Boolean);

  return rankSources(resolved);
};

const summarizeEvidence = (evidence = []) => ({
  threatCount: evidence.length,
  highestSeverity: evidence.reduce((highest, item) => {
    const order = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
    return (order[item.severity] || 0) > (order[highest] || 0) ? item.severity : highest;
  }, "info"),
  matchedThreatIds: evidence.map((item) => item.threatId),
});

module.exports = { correlateSources, summarizeEvidence };
