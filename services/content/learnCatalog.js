const fs = require("node:fs");
const path = require("node:path");
const { normalizeLanguage, localizeLesson } = require("../../packages/i18n/content");

const CONTENT_PATH = path.join(__dirname, "../../data/content/learn-modules.json");

const readModules = () => JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

const getLearnModules = ({ category = "", limit = 20, language = "en" } = {}) => {
  const normalizedCategory = String(category).trim().toLowerCase();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const selectedLanguage = normalizeLanguage(language);

  return readModules()
    .filter((module) => !normalizedCategory || String(module.category).toLowerCase() === normalizedCategory)
    .slice(0, safeLimit)
    .map((module) => localizeLesson(module, selectedLanguage));
};

const getLearnModule = (id, language = "en") => {
  const module = readModules().find((item) => item.id === id);
  return module ? localizeLesson(module, normalizeLanguage(language)) : null;
};

const getLearnCategories = () => [...new Set(readModules().map((module) => module.category))].sort();

module.exports = { getLearnModules, getLearnModule, getLearnCategories, localizeModule: localizeLesson, normalizeLanguage };
