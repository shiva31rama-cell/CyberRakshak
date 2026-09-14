const express = require("express");
const { searchThreats, getThreatById } = require("../../services/threat-intelligence/threatIntelligenceEngine");

const router = express.Router();

router.get("/", (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 20);
  const threats = searchThreats({
    text: req.query.q || "",
    category: req.query.category || "",
    limit,
  });

  return res.json({
    success: true,
    count: threats.length,
    threats,
    sourcePolicy: "authoritative-first",
  });
});

router.get("/:id", (req, res) => {
  const threat = getThreatById(req.params.id);
  if (!threat) {
    return res.status(404).json({ success: false, error: "Threat not found" });
  }

  return res.json({ success: true, threat });
});

module.exports = router;
