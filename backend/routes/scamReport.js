const express = require("express");
const { submitScamReport, getAllScamReports, getScamReportByCaseNumber, getUserScamReports, updateScamReportStatus, getScamStatistics } = require("../controllers/scamReportController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", submitScamReport);
router.get("/case/:caseNumber", getScamReportByCaseNumber);
router.get("/user/:userId", protect, getUserScamReports);
router.get("/", protect, authorize("admin"), getAllScamReports);
router.patch("/:id", protect, authorize("admin"), updateScamReportStatus);
router.get("/stats/overview", protect, authorize("admin"), getScamStatistics);

module.exports = router;
