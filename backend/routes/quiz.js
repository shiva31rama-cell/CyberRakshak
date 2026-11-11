const express = require("express");
const { getAllQuizzes, getQuizById, submitQuiz, getUserQuizResults, createQuiz } = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllQuizzes);
router.get("/results/:userId", protect, getUserQuizResults);
router.post("/", protect, authorize("admin"), createQuiz);
router.get("/:id", getQuizById);
router.post("/:id/submit", protect, submitQuiz);

module.exports = router;
