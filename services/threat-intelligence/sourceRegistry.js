const fs = require("node:fs");
const path = require("node:path");

const SOURCES_DIR = path.resolve(__dirname, "../../data/sources");
const TIER_BY_TYPE = {
  government: "authoritative",
  regulator: "authoritative",
  official_vendor: "authoritative",
  academic: "research",
  security_research: "research",
  reputable_media: "journalism",
  official_social: "official_social",
  public_repository: "community",
  community: "community",
};

const loadSources = () => {
  if (!fs.existsSync(SOURCES_DIR)) return [];

  return fs.readdirSync(SOURCES_DIR)
    .filter((file) => file.endsWith(".json") && file !== "schema.json")
    .flatMap((file) => {
      const parsed = JSON.parse(fs.readFileSync(path.join(SOURCES_DIR, file), "utf8"));
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.records)) return parsed.records;
      if (parsed && typeof parsed === "object" && Object.values(parsed).every((item) => item && typeof item === "object" && !Array.isArray(item))) {
        return Object.entries(parsed).map(([id, source]) => ({ id, ...source }));
      }
      return parsed && typeof parsed === "object" ? [parsed] : [];
    });
};

const normalizeSource = (source) => ({
  ...source,
  id: source.id || null,
  name: source.name || "Unknown source",
  tier: source.tier || TIER_BY_TYPE[source.sourceType] || "community",
  verified: source.verified ?? source.verification === "verified",
});

const getAllSources = () => loadSources().map(normalizeSource);
const getSource = (sourceId) => getAllSources().find((source) => source.id === sourceId) || null;

module.exports = { getAllSources, getSource };
