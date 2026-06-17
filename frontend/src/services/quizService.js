/**
 * Quiz Service
 * Handles quiz-related operations including fetching and submitting quiz answers
 */

import { getAuthToken } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get all available quizzes
 * @returns {Promise<Array>} Array of quiz objects
 */
export const getAllQuizzes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quizzes');
    }

    return data.data || [];
  } catch (error) {
    console.error('Get quizzes error:', error);
    throw error;
  }
};

/**
 * Get a specific quiz by ID
 * @param {string} quizId - Quiz ID
 * @returns {Promise<Object>} Quiz object with questions
 */
export const getQuizById = async (quizId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quiz');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get quiz error:', error);
    throw error;
  }
};

/**
 * Submit quiz answers
 * @param {string} quizId - Quiz ID
 * @param {Array} answers - Array of answer objects with questionId and selectedOption
 * @param {number} timeSpent - Time spent on quiz in seconds
 * @returns {Promise<Object>} Quiz result with score and passing status
 */
export const submitQuizAnswers = async (quizId, answers, timeSpent = 0) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to submit quiz');
    }

    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers,
        timeSpent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quiz');
    }

    return data.data || data;
  } catch (error) {
    console.error('Submit quiz error:', error);
    throw error;
  }
};

/**
 * Get user's quiz results
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of quiz result objects
 */
export const getUserResults = async (userId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view results');
    }

    const response = await fetch(`${API_BASE_URL}/quiz/results/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user results');
    }

    return data.data || [];
  } catch (error) {
    console.error('Get user results error:', error);
    throw error;
  }
};

/**
 * Get quiz result by ID
 * @param {string} resultId - Quiz result ID
 * @returns {Promise<Object>} Quiz result object with detailed information
 */
export const getQuizResult = async (resultId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view result');
    }

    const response = await fetch(`${API_BASE_URL}/quiz/result/${resultId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quiz result');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get quiz result error:', error);
    throw error;
  }
};

/**
 * Calculate quiz score locally (for frontend validation)
 * @param {Array} questions - Array of question objects with correctAnswer
 * @param {Array} answers - Array of user answers with selectedOption
 * @returns {Object} Score calculation result
 */
export const calculateScore = (questions, answers) => {
  let correctCount = 0;
  
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOption) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passingScore = 70;
  const passed = percentage >= passingScore;

  return {
    correctCount,
    totalQuestions,
    percentage,
    passed,
    passingScore,
  };
};
