import { apiRequest } from "./api";

export const getAllQuizzes = async () => {
  const data = await apiRequest("/quiz");
  return data.quizzes || [];
};

export const getQuizById = async (quizId) => {
  const data = await apiRequest(`/quiz/${encodeURIComponent(quizId)}`);
  return data.quiz || null;
};

export const submitQuizAnswers = async (quizId, answers, timeSpent = 0) => {
  const data = await apiRequest(`/quiz/${encodeURIComponent(quizId)}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers, timeSpent }),
  });
  return data.result || data;
};

export const getUserResults = async (userId) => {
  const data = await apiRequest(`/quiz/results/${encodeURIComponent(userId)}`);
  return data.results || [];
};

export const calculateScore = (questions = [], answers = []) => {
  let correctCount = 0;
  answers.forEach((answer) => {
    const question = questions.find(
      (q) => String(q.id ?? q._id) === String(answer.questionId)
    );
    if (question && question.correctAnswer === answer.selectedOption) {
      correctCount += 1;
    }
  });

  const totalQuestions = questions.length;
  const percentage = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  return {
    correctCount,
    totalQuestions,
    percentage,
    passed: percentage >= 70,
    passingScore: 70,
  };
};
