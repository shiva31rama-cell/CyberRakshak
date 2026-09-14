const express = require("express");
const { getRecoveryPlan, getRecoveryScenarios } = require("../../services/incidents/recoveryPlans");

const router = express.Router();

router.get("/scenarios", (req, res) => {
  res.json({ success: true, scenarios: getRecoveryScenarios() });
});

router.get("/:scenario", (req, res) => {
  const plan = getRecoveryPlan(req.params.scenario);
  if (!plan) {
    return res.status(404).json({ success: false, message: "Recovery scenario not found" });
  }

  res.json({
    success: true,
    scenario: req.params.scenario,
    plan,
    privacy: {
      dataStored: false,
      reminder: "Do not submit passwords, OTPs, PINs, full card numbers or recovery codes.",
    },
  });
});

module.exports = router;
