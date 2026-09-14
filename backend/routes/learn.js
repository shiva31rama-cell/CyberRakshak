const express = require("express");
const { getLearnModules, getLearnModule, getLearnCategories, normalizeLanguage } = require("../../services/content/learnCatalog");

const router = express.Router();

router.get("/categories", (req, res) => {
  res.json({ success: true, categories: getLearnCategories() });
});

router.get("/", (req, res) => {
  const language = normalizeLanguage(req.query.language);
  res.json({
    success: true,
    language,
    modules: getLearnModules({ category: req.query.category, limit: req.query.limit, language }),
  });
});

router.get("/:id", (req, res) => {
  const language = normalizeLanguage(req.query.language);
  const module = getLearnModule(req.params.id, language);
  if (!module) return res.status(404).json({ success: false, message: "Learning module not found" });
  res.json({ success: true, language, module });
});

module.exports = router;
