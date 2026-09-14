const fs = require("node:fs");
const path = require("node:path");

const SOURCES_DIR = path.resolve(__dirname, "../../data/sources");

const loadJsonFiles = () => {
  if (!fs.existsSync(SOURCES_DIR)) return [];

  return fs
    .readdirSync(SOURCES_DIR)
    .filter((file) => file.endsWith(".json") && !file.endsWith("schema.json"))
    .map((file) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(SOURCES_DIR, file), "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

const sources = loadJsonFiles();

const getAllSources = () => sources.map((source) => ({ ...source }));

const getSourceById = (id) => sources.find((source) => source.id === id) || null;

const normalizeSource = (source) => ({
  id: source.id || null,
  name: source.name || "Unknown source",
  url: source.url || null,
  sourceType: source.sourceType || "community",
  verification: source.verification || "unverified",
  region: source.region || null,
  authority: source.authority || null,
});

const resolveSourceReferences = (references = []) => {
  const ids = new Set();

  for (const reference of references) {
    if (typeof reference === "string") ids.add(reference);
    if (reference && typeof reference === "object") {
      if (reference.id) ids.add(reference.id);
      if (reference.name) {
        const matched = sources.find((source) => source.name === reference.name);
        if (matched?.id) ids.add(matched.id);
      }
    }
  }

  return [...ids]
    .map((id) => getSourceById(id))
    .filter(Boolean)
    .map(normalizeSource);
};

module.exports = { getAllSources, getSourceById, resolveSourceReferences }; 
