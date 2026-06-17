/**
 * Feedback Service
 * Handles user feedback submission and management
 */

import { getAuthToken } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Submit user feedback
 * @param {Object} feedbackData - Feedback data object
 * @param {number} feedbackData.rating - Rating from 1 to 5
 * @param {string} feedbackData.category - Feedback category
 * @param {string} feedbackData.comments - Feedback comments
 * @param {string} [feedbackData.name] - Optional user name
 * @param {string} [feedbackData.email] - Optional user email
 * @returns {Promise<Object>} Feedback submission response
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to submit feedback');
    }

    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    return data;
  } catch (error) {
    console.error('Submit feedback error:', error);
    throw error;
  }
};

/**
 * Submit anonymous feedback (no authentication required)
 * @param {Object} feedbackData - Feedback data object
 * @param {number} feedbackData.rating - Rating from 1 to 5
 * @param {string} feedbackData.category - Feedback category
 * @param {string} feedbackData.comments - Feedback comments
 * @param {string} feedbackData.name - User name
 * @param {string} feedbackData.email - User email
 * @returns {Promise<Object>} Feedback submission response
 */
export const submitAnonymousFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/anonymous`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    return data;
  } catch (error) {
    console.error('Submit anonymous feedback error:', error);
    throw error;
  }
};

/**
 * Get all feedback (admin only)
 * @returns {Promise<Array>} Array of feedback objects
 */
export const getAllFeedback = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view feedback');
    }

    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feedback');
    }

    return data.data || [];
  } catch (error) {
    console.error('Get feedback error:', error);
    throw error;
  }
};

/**
 * Get feedback by ID
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<Object>} Feedback object
 */
export const getFeedbackById = async (feedbackId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view feedback');
    }

    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feedback');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get feedback error:', error);
    throw error;
  }
};

/**
 * Update feedback status (admin only)
 * @param {string} feedbackId - Feedback ID
 * @param {string} status - New status value
 * @returns {Promise<Object>} Updated feedback object
 */
export const updateFeedbackStatus = async (feedbackId, status) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to update feedback');
    }

    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update feedback');
    }

    return data.data || data;
  } catch (error) {
    console.error('Update feedback error:', error);
    throw error;
  }
};

/**
 * Delete feedback (admin only)
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteFeedback = async (feedbackId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to delete feedback');
    }

    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete feedback');
    }

    return data;
  } catch (error) {
    console.error('Delete feedback error:', error);
    throw error;
  }
};
