const express = require("express");
const { getAllQuizzes, getQuizById, submitQuiz, getUserQuizResults, createQuiz } = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/submit", protect, submitQuiz);
router.get("/results/:userId", protect, getUserQuizResults);
router.post("/", protect, authorize("admin"), createQuiz);

module.exports = router;
