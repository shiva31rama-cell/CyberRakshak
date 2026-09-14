const fs = require("node:fs");
const path = require("node:path");

const THREATS_DIR = path.resolve(__dirname, "../../data/threats");

const findJsonFiles = (directory) => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findJsonFiles(fullPath);
    return entry.name.endsWith(".json") && entry.name !== "schema.json" ? [fullPath] : [];
  });
};

const readThreatRecords = () => findJsonFiles(THREATS_DIR).flatMap((file) => {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  return [parsed];
});

const catalog = readThreatRecords();

const searchThreats = (text) => {
  const normalized = String(text ?? "").toLowerCase();
  if (!normalized) return [];

  return catalog.filter((threat) => {
    const haystack = [
      threat.title,
      threat.description,
      ...(threat.categories || []),
      ...(threat.indicators || []),
      ...(threat.keywords || []),
    ].filter(Boolean).join(" ").toLowerCase();

    return haystack.includes(normalized);
  });
};

const getAllThreats = () => [...catalog];

module.exports = { getAllThreats, searchThreats };
