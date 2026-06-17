const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public route
router.post("/", submitFeedback);

// Protected routes
router.get("/", protect, getAllFeedback);
router.get("/:id", protect, getFeedbackById);
router.patch("/:id", protect, updateFeedbackStatus);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
