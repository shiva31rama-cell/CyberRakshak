const { rankSources } = require("../threat-intelligence/sourceTrust");
const { getSource } = require("../threat-intelligence/sourceRegistry");

const normalize = (value) => String(value ?? "")
  .toLowerCase()
  .replace(/[^a-z0-9+.#@:/_-]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const normalizeIndicator = (indicator) => {
  if (typeof indicator === "string") return { type: null, value: indicator };
  if (indicator && typeof indicator === "object") return { type: indicator.type || null, value: indicator.value || indicator.description || "" };
  return { type: null, value: "" };
};

const getThreatIndicators = (threat) => (threat.indicators || []).map(normalizeIndicator).filter((indicator) => indicator.value);
const getThreatSignals = (threat) => [
  ...(threat.keywords || []),
  ...(threat.signals || []),
  ...(threat.behavioralSignals || []),
].filter((value) => typeof value === "string" && value.trim().length >= 4);
const tokenSet = (value) => new Set(normalize(value).split(" ").filter((token) => token.length >= 3));

const signalMatches = (text, signals) => {
  const normalizedText = normalize(text);
  const textTokens = tokenSet(normalizedText);
  return signals.filter((signal) => {
    const normalizedSignal = normalize(signal);
    if (!normalizedSignal) return false;
    if (normalizedText.includes(normalizedSignal)) return true;
    const signalTokens = [...tokenSet(normalizedSignal)];
    if (signalTokens.length < 2) return false;
    const matched = signalTokens.filter((token) => textTokens.has(token)).length;
    return matched / signalTokens.length >= 0.75;
  });
};

const normalizeForExactMatch = (value, type) => {
  const normalized = normalize(value).replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return type === "domain" ? normalized.replace(/^www\./, "") : normalized;
};

const indicatorMatches = (extractedIndicators, threatIndicators) => {
  const extracted = extractedIndicators.map(normalizeIndicator).filter((indicator) => indicator.value);
  return threatIndicators.filter((candidate) => extracted.some((indicator) => {
    const sameType = !candidate.type || !indicator.type || candidate.type === indicator.type;
    return sameType && normalizeForExactMatch(candidate.value, candidate.type) === normalizeForExactMatch(indicator.value, indicator.type || candidate.type);
  }));
};

const categoryMatch = (categories, threat) => {
  const threatCategories = [...(threat.categories || []), threat.category].filter(Boolean).map(normalize);
  const localCategories = (categories || []).map(normalize);
  return threatCategories.some((category) => localCategories.includes(category));
};

const resolveRankedSources = (threat) => {
  const refs = [...(threat.sources || []), ...(threat.sourceReferences || [])];
  return rankSources(refs.map((ref) => {
    if (typeof ref === "string") return getSource(ref);
    return ref && typeof ref === "object" ? ref : null;
  }).filter(Boolean)).slice(0, 5);
};

const confidenceFromEvidence = ({ indicatorCount, signalCount, categoryMatched, rankedSources }) => {
  let confidence = 25;
  confidence += Math.min(indicatorCount * 35, 70);
  confidence += Math.min(signalCount * 10, 20);
  if (categoryMatched) confidence += 5;
  if (rankedSources.some((source) => source.tierRank === 1)) confidence += 30;
  return Math.min(confidence, 100);
};

const correlateThreats = ({ text = "", indicators = [], categories = [], threats = [] } = {}) => {
  const results = [];
  for (const threat of threats) {
    const matchedIndicators = indicatorMatches(indicators, getThreatIndicators(threat));
    const matchedSignals = signalMatches(text, getThreatSignals(threat));
    const categoryMatched = categoryMatch(categories, threat);
    if (matchedIndicators.length === 0 && matchedSignals.length === 0) continue;
    const rankedSources = resolveRankedSources(threat);
    results.push({
      threatId: threat.id || null,
      title: threat.title || "Unspecified threat",
      category: threat.category || (threat.categories || [])[0] || "unknown",
      severity: threat.severity || "info",
      confidence: confidenceFromEvidence({ indicatorCount: matchedIndicators.length, signalCount: matchedSignals.length, categoryMatched, rankedSources }),
      matchedIndicators,
      matchedSignals,
      categoryMatched,
      sourceReferences: rankedSources.map((source) => source.id || source.name),
      sources: rankedSources,
      publishedAt: threat.publishedAt || null,
      updatedAt: threat.updatedAt || null,
    });
  }
  const severityRank = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
  return results.sort((a, b) => (severityRank[b.severity] - severityRank[a.severity]) || (b.confidence - a.confidence));
};

module.exports = { correlateThreats, normalize, indicatorMatches, signalMatches };
