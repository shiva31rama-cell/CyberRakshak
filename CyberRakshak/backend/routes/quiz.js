const express = require("express");
const {
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getUserQuizResults,
  createQuiz,
} = require("../controllers/quizController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);

// Protected routes
router.post("/:id/submit", protect, submitQuiz);
router.get("/results/:userId", protect, getUserQuizResults);

// Admin routes
router.post("/", protect, createQuiz);

module.exports = router;
