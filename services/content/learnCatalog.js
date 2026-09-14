const fs = require("fs");
const path = require("path");

const CONTENT_PATH = path.join(__dirname, "../../data/content/learn-modules.json");

const readModules = () => JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

const normalizeLanguage = (language) => (String(language).trim().toLowerCase() === "te" ? "te" : "en");

const localizeModule = (module, language = "en") => {
  const selectedLanguage = normalizeLanguage(language);
  const copy = module[selectedLanguage] || module.en;
  return {
    id: module.id,
    category: module.category,
    severity: module.severity,
    durationMinutes: module.durationMinutes,
    sourceIds: module.sourceIds,
    language: selectedLanguage,
    ...copy,
  };
};

const getLearnModules = ({ category = "", limit = 20, language = "en" } = {}) => {
  const normalizedCategory = String(category).trim().toLowerCase();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  return readModules()
    .filter((module) => !normalizedCategory || module.category.toLowerCase() === normalizedCategory)
    .slice(0, safeLimit)
    .map((module) => localizeModule(module, language));
};

const getLearnModule = (id, language = "en") => {
  const module = readModules().find((item) => item.id === id);
  return module ? localizeModule(module, language) : null;
};

const getLearnCategories = () => [...new Set(readModules().map((module) => module.category))].sort();

module.exports = { getLearnModules, getLearnModule, getLearnCategories, localizeModule, normalizeLanguage };
