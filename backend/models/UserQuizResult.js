const mongoose = require("mongoose");

const userQuizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionId: mongoose.Schema.Types.ObjectId,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserQuizResult = mongoose.model("UserQuizResult", userQuizResultSchema);

module.exports = UserQuizResult;
