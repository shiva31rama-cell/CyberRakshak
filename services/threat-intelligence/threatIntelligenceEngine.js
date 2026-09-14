const { getAllThreats } = require("../risk-engine/threatCatalog");
const { getAllSources } = require("./sourceRegistry");
const { rankSources } = require("./sourceTrust");

const normalize = (value) => String(value || "").trim().toLowerCase();

const tokenize = (value) => normalize(value)
  .split(/[^a-z0-9+@._-]+/i)
  .filter((token) => token.length >= 3);

const scoreKeywordOverlap = (text, threat) => {
  const textTokens = new Set(tokenize(text));
  const keywords = [
    ...(Array.isArray(threat.keywords) ? threat.keywords : []),
    ...(Array.isArray(threat.tags) ? threat.tags : []),
  ].flatMap(tokenize);

  if (keywords.length === 0) return 0;
  const matches = [...new Set(keywords)].filter((keyword) => textTokens.has(keyword));
  return Math.min(1, matches.length / Math.min(3, keywords.length));
};

const scoreIndicatorOverlap = (text, threat) => {
  const normalizedText = normalize(text);
  const indicators = Array.isArray(threat.indicators) ? threat.indicators : [];
  const matches = indicators.filter((indicator) => {
    const value = typeof indicator === "string"
      ? indicator
      : indicator?.value || indicator?.description || "";
    return value && normalizedText.includes(normalize(value));
  });
  return {
    score: matches.length > 0 ? Math.min(1, matches.length / 2) : 0,
    matches,
  };
};

const sourceMap = () => new Map(getAllSources().map((source) => [source.id, source]));

const enrichSource = (source, now) => ({
  id: source.id,
  name: source.name,
  tier: source.tier,
  verified: Boolean(source.verified),
  confidence: source.confidence ?? null,
  publishedAt: source.publishedAt || null,
  retrievedAt: source.retrievedAt || now,
  url: source.url || null,
});

const searchThreats = ({ text = "", category, limit = 8 } = {}) => {
  const threats = getAllThreats();
  const now = new Date().toISOString();
  const sources = sourceMap();
  const normalizedCategory = normalize(category);

  return threats
    .filter((threat) => !normalizedCategory || normalize(threat.category) === normalizedCategory)
    .map((threat) => {
      const keywordScore = scoreKeywordOverlap(text, threat);
      const indicatorResult = scoreIndicatorOverlap(text, threat);
      const sourceRecords = (threat.sources || [])
        .map((id) => sources.get(id))
        .filter(Boolean);
      const rankedSources = rankSources(sourceRecords).map((source) => enrichSource(source, now));
      const sourceConfidence = rankedSources.length > 0
        ? rankedSources.reduce((sum, source) => sum + Number(source.confidence || 0), 0) / rankedSources.length
        : 0;

      return {
        threatId: threat.id,
        title: threat.title,
        category: threat.category || "general",
        severity: threat.severity || "medium",
        description: threat.description || "",
        relevance: Number(((keywordScore * 0.45) + (indicatorResult.score * 0.55)).toFixed(3)),
        matchedIndicators: indicatorResult.matches,
        sourceConfidence: Math.round(sourceConfidence),
        sources: rankedSources,
      };
    })
    .filter((item) => item.relevance > 0 || !text.trim())
    .sort((a, b) => {
      const severityWeight = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
      return (severityWeight[b.severity] - severityWeight[a.severity]) || (b.relevance - a.relevance);
    })
    .slice(0, Math.max(1, Math.min(Number(limit) || 8, 20)));
};

const getThreatById = (id) => {
  const threat = getAllThreats().find((item) => item.id === id);
  if (!threat) return null;
  const sources = sourceMap();
  return {
    ...threat,
    sources: rankSources((threat.sources || []).map((sourceId) => sources.get(sourceId)).filter(Boolean)),
  };
};

module.exports = { searchThreats, getThreatById };
