const SOURCE_TIERS = Object.freeze({
  authoritative: 1,
  research: 2,
  journalism: 3,
  official_social: 4,
  community: 5,
});

const normalizeTier = (value) => {
  const key = String(value || "").toLowerCase();
  return SOURCE_TIERS[key] || 5;
};

const calculateSourceConfidence = ({ tier, verified = false, publishedAt, retrievedAt } = {}) => {
  const tierScore = Math.max(0, 60 - (normalizeTier(tier) - 1) * 12);
  const verificationScore = verified ? 25 : 0;
  const freshnessScore = publishedAt && retrievedAt ? 15 : 5;
  return Math.min(100, tierScore + verificationScore + freshnessScore);
};

const rankSources = (sources = []) => sources
  .map((source) => ({
    ...source,
    tierRank: normalizeTier(source.tier),
    confidence: calculateSourceConfidence(source),
  }))
  .sort((a, b) => b.confidence - a.confidence || a.tierRank - b.tierRank);

module.exports = { SOURCE_TIERS, calculateSourceConfidence, rankSources };
