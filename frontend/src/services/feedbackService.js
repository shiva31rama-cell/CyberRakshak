import { apiRequest } from "./api";

export const submitFeedback = async (feedbackData) =>
  apiRequest("/feedback", {
    method: "POST",
    body: JSON.stringify(feedbackData),
  });

// Backward-compatible alias: the backend accepts feedback publicly.
export const submitAnonymousFeedback = submitFeedback;

export const getAllFeedback = async () => {
  const data = await apiRequest("/feedback");
  return data.feedback || [];
};

export const getFeedbackById = async (feedbackId) => {
  const data = await apiRequest(`/feedback/${encodeURIComponent(feedbackId)}`);
  return data.feedback || null;
};

export const updateFeedbackStatus = async (feedbackId, status) => {
  const data = await apiRequest(`/feedback/${encodeURIComponent(feedbackId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.feedback || data;
};

export const deleteFeedback = async (feedbackId) =>
  apiRequest(`/feedback/${encodeURIComponent(feedbackId)}`, {
    method: "DELETE",
  });
