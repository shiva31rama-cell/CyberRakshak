const Quiz = require("../models/Quiz");
const UserQuizResult = require("../models/UserQuizResult");

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.options.isCorrect").lean();
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select("-questions.options.isCorrect").lean();
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({ success: false, message: status === 400 ? "Invalid quiz ID" : "Error fetching quiz" });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent = 0 } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Answers must be an array" });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    if (!quiz.questions.length) return res.status(400).json({ success: false, message: "Quiz has no questions" });
    if (answers.length > quiz.questions.length) {
      return res.status(400).json({ success: false, message: "Too many answers submitted" });
    }

    const processedAnswers = [];
    const answeredQuestionIds = new Set();
    let correctCount = 0;

    for (const answer of answers) {
      if (!answer || !answer.questionId || !answer.selectedOptionId) continue;

      const question = quiz.questions.find((q) => q._id.toString() === String(answer.questionId));
      if (!question || answeredQuestionIds.has(question._id.toString())) continue;

      const selectedOption = question.options.find(
        (opt) => opt._id.toString() === String(answer.selectedOptionId)
      );
      if (!selectedOption) continue;

      answeredQuestionIds.add(question._id.toString());
      const isCorrect = Boolean(selectedOption.isCorrect);
      if (isCorrect) correctCount += 1;
      processedAnswers.push({
        questionId: question._id,
        selectedOptionId: selectedOption._id,
        isCorrect,
      });
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const numericTimeSpent = Number(timeSpent);

    await UserQuizResult.create({
      userId: req.user.id,
      quizId: quiz._id,
      moduleId: quiz.moduleId,
      moduleName: quiz.moduleName,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      passed,
      timeSpent: Number.isFinite(numericTimeSpent) ? Math.max(0, numericTimeSpent) : 0,
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
    res.status(500).json({ success: false, message: "Error submitting quiz" });
  }
};

exports.getUserQuizResults = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: "You can only view your own quiz results" });
    }
    const results = await UserQuizResult.find({ userId: req.params.userId })
      .sort({ completedAt: -1 })
      .lean();
    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching quiz results" });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, moduleId, moduleName, questions, passingScore = 70 } = req.body;
    const numericPassingScore = Number(passingScore);

    if (!title || !moduleId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Title, moduleId, and at least one question are required" });
    }
    if (!Number.isFinite(numericPassingScore) || numericPassingScore < 0 || numericPassingScore > 100) {
      return res.status(400).json({ success: false, message: "Passing score must be between 0 and 100" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      moduleId,
      moduleName,
      questions,
      passingScore: numericPassingScore,
      totalQuestions: questions.length,
    });
    res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Error creating quiz" });
  }
};
