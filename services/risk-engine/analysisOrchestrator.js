const { analyzeText } = require("./localRiskEngine");
const { extractIndicators } = require("./indicatorExtractor");
const { getAllThreats } = require("./threatCatalog");
const { correlateThreats } = require("./threatCorrelation");
const { resolveSourceReferences } = require("./sourceRegistry");
const { createActionPlan } = require("./actionPlanner");

const MAX_INPUT_LENGTH = 12000;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const levelFromScore = (score) => {
  if (score >= 70) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  if (score > 0) return "low";
  return "info";
};

const scoreBoostForEvidence = (evidence) => {
  const severityBoost = {
    critical: 40,
    high: 28,
    medium: 15,
    low: 5,
    info: 0,
  }[evidence.severity] ?? 0;
  const confidenceBoost = Math.round((evidence.confidence || 0) / 20);
  const indicatorBoost = Math.min((evidence.matchedIndicators || []).length * 8, 16);
  const signalBoost = Math.min((evidence.matchedSignals || []).length * 3, 9);
  return severityBoost + confidenceBoost + indicatorBoost + signalBoost;
};

const analyze = ({ text = "", inputType = "text" } = {}) => {
  const safeText = String(text ?? "").slice(0, MAX_INPUT_LENGTH);
  const local = analyzeText(safeText, inputType);
  const extracted = extractIndicators(safeText);

  if (!safeText.trim()) {
    const assessment = {
      ...local,
      indicators: [],
      evidence: [],
      sourceReferences: [],
      verifiedSources: [],
    };
    return { ...assessment, actionPlan: createActionPlan(assessment) };
  }

  const evidence = correlateThreats({
    text: safeText,
    indicators: extracted,
    categories: local.categories,
    threats: getAllThreats(),
  });

  const evidenceBoost = evidence.length > 0
    ? Math.min(evidence.reduce((total, item) => total + scoreBoostForEvidence(item), 0), 70)
    : 0;
  const score = clamp(local.score + evidenceBoost, 0, 100);
  const riskLevel = levelFromScore(score);
  const sourceReferences = [
    ...new Set([
      ...(local.sourceReferences || []),
      ...evidence.flatMap((item) => item.sourceReferences || []),
    ]),
  ];

  const assessment = {
    ...local,
    score,
    riskLevel,
    indicators: extracted,
    evidence,
    sourceReferences,
    verifiedSources: resolveSourceReferences(sourceReferences),
  };

  if (evidence.length > 0) {
    const evidenceReasons = evidence.slice(0, 3).map((item) =>
      `Matched threat intelligence: ${item.title} (${item.severity}, ${item.confidence}% confidence).`
    );
    assessment.reasons = [...new Set([...(assessment.reasons || []), ...evidenceReasons])];
  }

  return { ...assessment, actionPlan: createActionPlan(assessment) };
};

module.exports = { analyze, levelFromScore, scoreBoostForEvidence };
