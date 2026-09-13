const express = require("express");
const {
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getUserQuizResults,
  createQuiz,
} = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllQuizzes);
// Static routes must be declared before /:id to avoid treating "results" as a quiz ID.
router.get("/results/:userId", protect, getUserQuizResults);
router.post("/:id/submit", protect, submitQuiz);
router.post("/", protect, authorize("admin"), createQuiz);
router.get("/:id", getQuizById);

module.exports = router;
