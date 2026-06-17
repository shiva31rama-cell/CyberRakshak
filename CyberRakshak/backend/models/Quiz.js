const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a quiz title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    moduleId: {
      type: String,
      required: [true, "Please provide a module ID"],
    },
    moduleName: {
      type: String,
      required: [true, "Please provide a module name"],
    },
    questions: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        questionText: {
          type: String,
          required: true,
        },
        options: [
          {
            _id: mongoose.Schema.Types.ObjectId,
            text: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        explanation: {
          type: String,
        },
      },
    ],
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
