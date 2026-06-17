/**
 * Scam Report Service
 * Handles scam reporting and case management
 */

import { getAuthToken } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Submit a scam report
 * @param {Object} reportData - Scam report data
 * @param {string} reportData.reporterName - Reporter's full name
 * @param {string} reportData.reporterEmail - Reporter's email
 * @param {string} reportData.reporterPhone - Reporter's phone number
 * @param {string} reportData.scamType - Type of scam
 * @param {string} reportData.description - Detailed description of scam
 * @param {string} [reportData.suspectName] - Suspected perpetrator's name
 * @param {string} [reportData.suspectEmail] - Suspected perpetrator's email
 * @param {number} [reportData.amountLost] - Amount lost in rupees
 * @param {string} [reportData.evidenceDetails] - Evidence or proof details
 * @returns {Promise<Object>} Report submission response with case number
 */
export const submitScamReport = async (reportData) => {
  try {
    const token = getAuthToken();

    // Scam reports can be submitted with or without authentication
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/scam-report`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reportData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit scam report');
    }

    return data;
  } catch (error) {
    console.error('Submit scam report error:', error);
    throw error;
  }
};

/**
 * Get all scam reports (admin only)
 * @returns {Promise<Array>} Array of scam report objects
 */
export const getAllScamReports = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view reports');
    }

    const response = await fetch(`${API_BASE_URL}/scam-report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reports');
    }

    return data.data || [];
  } catch (error) {
    console.error('Get scam reports error:', error);
    throw error;
  }
};

/**
 * Get scam report by case number
 * @param {string} caseNumber - Case number of the report
 * @returns {Promise<Object>} Scam report object
 */
export const getReportByCaseNumber = async (caseNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scam-report/case/${caseNumber}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch report');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get report by case number error:', error);
    throw error;
  }
};

/**
 * Get scam report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Scam report object
 */
export const getReportById = async (reportId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view report');
    }

    const response = await fetch(`${API_BASE_URL}/scam-report/${reportId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch report');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get report error:', error);
    throw error;
  }
};

/**
 * Update scam report status (admin only)
 * @param {string} reportId - Report ID
 * @param {string} status - New status value
 * @returns {Promise<Object>} Updated report object
 */
export const updateReportStatus = async (reportId, status) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to update report');
    }

    const response = await fetch(`${API_BASE_URL}/scam-report/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update report');
    }

    return data.data || data;
  } catch (error) {
    console.error('Update report error:', error);
    throw error;
  }
};

/**
 * Get scam statistics (admin only)
 * @returns {Promise<Object>} Statistics object with scam type breakdown
 */
export const getScamStatistics = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('User must be authenticated to view statistics');
    }

    const response = await fetch(`${API_BASE_URL}/scam-report/stats/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }

    return data.data || data;
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Generate case number locally (for frontend reference)
 * Format: CR-YYYY-MM-DD-XXXXX
 * @returns {string} Generated case number
 */
export const generateCaseNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  return `CR-${year}-${month}-${day}-${random}`;
};

/**
 * Scam types for categorization
 */
export const SCAM_TYPES = [
  'UPI Fraud',
  'Fake Call/SMS',
  'Online Shopping Fraud',
  'Job Scam',
  'Dating Scam',
  'Investment Fraud',
  'Phishing',
  'Tech Support Scam',
  'Prize/Lottery Scam',
  'Government Impersonation',
  'Banking Fraud',
  'Insurance Scam',
  'Other',
];
