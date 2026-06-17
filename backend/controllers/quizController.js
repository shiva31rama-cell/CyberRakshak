const Quiz = require("../models/Quiz");
const UserQuizResult = require("../models/UserQuizResult");

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.options.isCorrect");

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching quizzes",
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quiz/:id
// @access  Public
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select(
      "-questions.options.isCorrect"
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching quiz",
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/:id/submit
// @access  Private
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let correctCount = 0;
    const processedAnswers = [];

    // Verify and score answers
    answers.forEach((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (question) {
        const selectedOption = question.options.find(
          (opt) => opt._id.toString() === answer.selectedOptionId
        );

        const isCorrect =
          selectedOption && selectedOption.isCorrect ? true : false;

        if (isCorrect) {
          correctCount++;
        }

        processedAnswers.push({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect,
        });
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save quiz result
    const result = await UserQuizResult.create({
      userId: req.user?.id,
      quizId,
      moduleId: quiz.moduleId,
      moduleName: quiz.moduleName,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      passed,
      timeSpent: timeSpent || 0,
    });

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        score,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length,
        passed,
        message: passed
          ? `Congratulations! You passed with ${score}%`
          : `You scored ${score}%. Minimum passing score is ${quiz.passingScore}%`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting quiz",
    });
  }
};

// @desc    Get user quiz results
// @route   GET /api/quiz/results/:userId
// @access  Private
exports.getUserQuizResults = async (req, res) => {
  try {
    const results = await UserQuizResult.find({
      userId: req.params.userId,
    }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching quiz results",
    });
  }
};

// @desc    Create quiz (Admin only)
// @route   POST /api/quiz
// @access  Private
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, moduleId, moduleName, questions, passingScore } =
      req.body;

    const quiz = await Quiz.create({
      title,
      description,
      moduleId,
      moduleName,
      questions,
      passingScore: passingScore || 70,
      totalQuestions: questions.length,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating quiz",
    });
  }
};
