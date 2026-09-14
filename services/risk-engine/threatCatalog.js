const fs = require("node:fs");
const path = require("node:path");

const THREATS_DIR = path.resolve(__dirname, "../../data/threats");

const readThreatRecords = () => {
  if (!fs.existsSync(THREATS_DIR)) return [];

  return fs
    .readdirSync(THREATS_DIR)
    .filter((file) => file.endsWith(".json") && file !== "schema.json")
    .map((file) => {
      const raw = fs.readFileSync(path.join(THREATS_DIR, file), "utf8");
      return JSON.parse(raw);
    });
};

const catalog = readThreatRecords();

const searchThreats = (text) => {
  const normalized = String(text ?? "").toLowerCase();

  return catalog.filter((threat) => {
    const haystack = [
      threat.title,
      threat.description,
      ...(threat.categories || []),
      ...(threat.indicators || []),
      ...(threat.keywords || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return normalized && haystack.includes(normalized);
  });
};

const getAllThreats = () => [...catalog];

module.exports = { getAllThreats, searchThreats };
