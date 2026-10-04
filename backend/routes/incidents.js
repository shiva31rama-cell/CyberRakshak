const express = require("express");
const { createIncidentPlan } = require("../controllers/incidentController");

const router = express.Router();
router.post("/", createIncidentPlan);

module.exports = router;
