const { analyzeText } = require("./localRiskEngine");
const { extractIndicators } = require("./indicatorExtractor");
const { getAllThreats } = require("./threatCatalog");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const levelFromScore = (score) => {
  if (score >= 70) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  if (score > 0) return "low";
  return "info";
};

const indicatorValues = (indicators) =>
  new Set(indicators.map((indicator) => indicator.value.toLowerCase()));

const analyze = ({ text = "", inputType = "text" } = {}) => {
  const local = analyzeText(text, inputType);
  const extracted = extractIndicators(text);
  const knownIndicators = indicatorValues(extracted);
  const evidence = [];

  for (const threat of getAllThreats()) {
    const matches = (threat.indicators || []).filter((indicator) =>
      knownIndicators.has(String(indicator).toLowerCase()),
    );

    if (matches.length > 0) {
      evidence.push({
        threatId: threat.id,
        title: threat.title,
        severity: threat.severity,
        matches,
        sourceReferences: threat.sources || [],
      });
    }
  }

  const evidenceBoost = evidence.length > 0
    ? Math.max(...evidence.map((item) => {
        if (item.severity === "critical") return 45;
        if (item.severity === "high") return 30;
        if (item.severity === "medium") return 15;
        return 5;
      }))
    : 0;

  const score = clamp(Math.max(local.score, local.score + evidenceBoost), 0, 100);

  return {
    ...local,
    score,
    riskLevel: levelFromScore(score),
    indicators: extracted,
    evidence,
    sourceReferences: [
      ...new Set([
        ...(local.sourceReferences || []),
        ...evidence.flatMap((item) => item.sourceReferences || []),
      ]),
    ],
  };
};

module.exports = { analyze };
