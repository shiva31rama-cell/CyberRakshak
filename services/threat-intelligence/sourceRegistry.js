const fs = require("node:fs");
const path = require("node:path");

const SOURCES_DIR = path.resolve(__dirname, "../../data/sources");

const loadSources = () => {
  if (!fs.existsSync(SOURCES_DIR)) return [];

  return fs.readdirSync(SOURCES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(SOURCES_DIR, file), "utf8")))
    .flatMap((record) => Array.isArray(record) ? record : [record]);
};

const getAllSources = () => loadSources();

const getSource = (sourceId) => getAllSources().find((source) => source.id === sourceId) || null;

module.exports = { getAllSources, getSource };
