const { getAllThreats } = require("../risk-engine/threatCatalog");
const { getAllSources } = require("./sourceRegistry");
const { rankSources } = require("./sourceTrust");

const normalize = (value) => String(value || "").trim().toLowerCase();
const tokenize = (value) => normalize(value).split(/[^a-z0-9+@._-]+/i).filter((token) => token.length >= 3);

const scoreKeywordOverlap = (text, threat) => {
  const textTokens = new Set(tokenize(text));
  const keywords = [
    ...(Array.isArray(threat.keywords) ? threat.keywords : []),
    ...(Array.isArray(threat.tags) ? threat.tags : []),
  ].flatMap(tokenize);
  if (!keywords.length) return 0;
  const matches = [...new Set(keywords)].filter((keyword) => textTokens.has(keyword));
  return Math.min(1, matches.length / Math.min(3, keywords.length));
};

const scoreIndicatorOverlap = (text, threat) => {
  const normalizedText = normalize(text);
  const indicators = Array.isArray(threat.indicators) ? threat.indicators : [];
  const matches = indicators.filter((indicator) => {
    const value = typeof indicator === "string" ? indicator : indicator?.value || indicator?.description || "";
    return value && normalizedText.includes(normalize(value));
  });
  return { score: matches.length ? Math.min(1, matches.length / 2) : 0, matches };
};

const sourceMap = () => new Map(getAllSources().filter((source) => source.id).map((source) => [source.id, source]));

const normalizeInlineSource = (source, now) => ({
  id: source.id || `inline-${normalize(source.name).replace(/[^a-z0-9]+/g, "-")}`,
  name: source.name || "Unknown source",
  url: source.url || null,
  tier: source.tier || source.trustTier || (source.sourceType === "government" || source.sourceType === "regulator" ? "authoritative" : "community"),
  verified: Boolean(source.verified || source.verification === "verified" || source.verificationStatus === "official-source"),
  publishedAt: source.publishedAt || null,
  retrievedAt: source.retrievedAt || now,
});

const resolveThreatSources = (threat, sources, now) => {
  const references = [
    ...(Array.isArray(threat.sources) ? threat.sources : []),
    ...(Array.isArray(threat.sourceReferences) ? threat.sourceReferences : []),
  ];
  return references.map((reference) => {
    if (typeof reference === "string") return sources.get(reference) || null;
    if (reference && typeof reference === "object") {
      return sources.get(reference.sourceId || reference.id) || normalizeInlineSource(reference, now);
    }
    return null;
  }).filter(Boolean);
};

const enrichSource = (source, now) => ({
  ...source,
  id: source.id || null,
  name: source.name || "Unknown source",
  tier: source.tier || "community",
  verified: Boolean(source.verified),
  retrievedAt: source.retrievedAt || now,
});

const normalizeThreat = (threat) => ({
  ...threat,
  category: threat.category || threat.categories?.[0] || "general",
  description: threat.description || threat.summary || "",
  severity: ["critical", "high", "medium", "low", "info"].includes(threat.severity) ? threat.severity : "info",
  keywords: Array.isArray(threat.keywords) ? threat.keywords : [],
  tags: Array.isArray(threat.tags) ? threat.tags : [],
});

const searchThreats = ({ text = "", category, limit = 8 } = {}) => {
  const now = new Date().toISOString();
  const sources = sourceMap();
  const normalizedCategory = normalize(category);

  return getAllThreats()
    .map(normalizeThreat)
    .filter((threat) => !normalizedCategory || normalize(threat.category) === normalizedCategory)
    .map((threat) => {
      const keywordScore = scoreKeywordOverlap(text, threat);
      const indicatorResult = scoreIndicatorOverlap(text, threat);
      const rankedSources = rankSources(resolveThreatSources(threat, sources, now)).map((source) => enrichSource(source, now));
      const sourceConfidence = rankedSources.length ? rankedSources.reduce((sum, source) => sum + Number(source.confidence || 0), 0) / rankedSources.length : 0;
      return {
        threatId: threat.id,
        title: threat.title,
        category: threat.category,
        severity: threat.severity,
        description: threat.description,
        relevance: Number(((keywordScore * 0.45) + (indicatorResult.score * 0.55)).toFixed(3)),
        matchedIndicators: indicatorResult.matches,
        sourceConfidence: Math.round(sourceConfidence),
        sources: rankedSources,
        publishedAt: threat.publishedAt || null,
        updatedAt: threat.updatedAt || null,
      };
    })
    .filter((item) => item.relevance > 0 || !String(text).trim())
    .sort((a, b) => ({ critical: 4, high: 3, medium: 2, low: 1, info: 0 }[b.severity] - ({ critical: 4, high: 3, medium: 2, low: 1, info: 0 }[a.severity]) || b.relevance - a.relevance))
    .slice(0, Math.max(1, Math.min(Number(limit) || 8, 20)));
};

const getThreatById = (id) => {
  const threat = getAllThreats().map(normalizeThreat).find((item) => item.id === id);
  if (!threat) return null;
  const now = new Date().toISOString();
  const rankedSources = rankSources(resolveThreatSources(threat, sourceMap(), now)).map((source) => enrichSource(source, now));
  return { ...threat, sources: rankedSources };
};

module.exports = { searchThreats, getThreatById };
