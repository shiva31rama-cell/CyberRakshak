const express = require("express");
const { submitFeedback, getAllFeedback, getFeedbackById, updateFeedbackStatus, deleteFeedback } = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", protect, authorize("admin"), getAllFeedback);
router.get("/:id", protect, authorize("admin"), getFeedbackById);
router.patch("/:id", protect, authorize("admin"), updateFeedbackStatus);
router.delete("/:id", protect, authorize("admin"), deleteFeedback);

module.exports = router;
