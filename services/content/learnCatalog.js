const fs = require("fs");
const path = require("path");

const CONTENT_PATH = path.join(__dirname, "../../data/content/learn-modules.json");

const readModules = () => JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

const getLearnModules = ({ category = "", limit = 20 } = {}) => {
  const normalizedCategory = String(category).trim().toLowerCase();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  return readModules()
    .filter((module) => !normalizedCategory || module.category.toLowerCase() === normalizedCategory)
    .slice(0, safeLimit);
};

const getLearnModule = (id) => readModules().find((module) => module.id === id) || null;

const getLearnCategories = () => [...new Set(readModules().map((module) => module.category))].sort();

module.exports = { getLearnModules, getLearnModule, getLearnCategories };
