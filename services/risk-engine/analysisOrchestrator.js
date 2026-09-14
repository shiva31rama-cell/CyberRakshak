const { analyzeText } = require("./localRiskEngine");
const { extractIndicators } = require("./indicatorExtractor");
const { getAllThreats } = require("./threatCatalog");
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

const indicatorKey = (indicator) => `${indicator.type}:${String(indicator.value).toLowerCase()}`;

const buildIndicatorIndex = (indicators) =>
  new Set(indicators.map(indicatorKey));

const normalizeThreatIndicator = (indicator) => {
  if (typeof indicator === "string") return { type: null, value: indicator };
  if (indicator && typeof indicator === "object") {
    return { type: indicator.type || null, value: indicator.value || indicator.description || "" };
  }
  return { type: null, value: "" };
};

const findThreatMatches = (threat, extracted) => {
  const index = buildIndicatorIndex(extracted);
  const values = new Set(extracted.map((indicator) => String(indicator.value).toLowerCase()));

  return (threat.indicators || [])
    .map(normalizeThreatIndicator)
    .filter(({ type, value }) => {
      if (!value) return false;
      const normalized = String(value).toLowerCase();
      return (type && index.has(`${type}:${normalized}`)) || values.has(normalized);
    });
};

const scoreBoostForSeverity = (severity) => {
  if (severity === "critical") return 45;
  if (severity === "high") return 30;
  if (severity === "medium") return 15;
  return 5;
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
    };
    return {
      ...assessment,
      actionPlan: createActionPlan(assessment),
    };
  }

  const evidence = [];

  for (const threat of getAllThreats()) {
    const matches = findThreatMatches(threat, extracted);

    if (matches.length > 0) {
      evidence.push({
        threatId: threat.id,
        title: threat.title,
        severity: threat.severity,
        matches,
        sourceReferences: threat.sources || [],
        confidence: threat.confidence ?? null,
        publishedAt: threat.publishedAt ?? null,
        updatedAt: threat.updatedAt ?? null,
      });
    }
  }

  const evidenceBoost = evidence.length > 0
    ? Math.max(...evidence.map((item) => scoreBoostForSeverity(item.severity)))
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

  return {
    ...assessment,
    actionPlan: createActionPlan(assessment),
  };
};

module.exports = { analyze, levelFromScore };
