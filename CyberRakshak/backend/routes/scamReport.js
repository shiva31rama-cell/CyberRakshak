const express = require("express");
const {
  submitScamReport,
  getAllScamReports,
  getScamReportByCaseNumber,
  getUserScamReports,
  updateScamReportStatus,
  getScamStatistics,
} = require("../controllers/scamReportController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public route
router.post("/", submitScamReport);
router.get("/case/:caseNumber", getScamReportByCaseNumber);

// Protected routes
router.get("/user/:userId", protect, getUserScamReports);

// Admin routes
router.get("/", protect, getAllScamReports);
router.patch("/:id", protect, updateScamReportStatus);
router.get("/stats/overview", protect, getScamStatistics);

module.exports = router;
