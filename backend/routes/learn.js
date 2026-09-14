const express = require("express");
const { getLearnModules, getLearnModule, getLearnCategories } = require("../../services/content/learnCatalog");

const router = express.Router();

router.get("/categories", (req, res) => {
  res.json({ success: true, categories: getLearnCategories() });
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    modules: getLearnModules({ category: req.query.category, limit: req.query.limit }),
  });
});

router.get("/:id", (req, res) => {
  const module = getLearnModule(req.params.id);
  if (!module) return res.status(404).json({ success: false, message: "Learning module not found" });
  res.json({ success: true, module });
});

module.exports = router;
