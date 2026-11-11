import { apiRequest } from "./api";

export const getAdminScamReports = async () => {
  const data = await apiRequest("/scam-report");
  return data.reports || [];
};

export const getAdminScamStatistics = async () => {
  const data = await apiRequest("/scam-report/stats/overview");
  return data.statistics || {};
};

export const updateAdminScamReportStatus = async (reportId, status) => {
  const data = await apiRequest(`/scam-report/${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.report || data;
};

export const getAdminFeedback = async () => {
  const data = await apiRequest("/feedback");
  return data.feedback || [];
};

export const updateAdminFeedbackStatus = async (feedbackId, status) => {
  const data = await apiRequest(`/feedback/${encodeURIComponent(feedbackId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.feedback || data;
};

export const deleteAdminFeedback = async (feedbackId) =>
  apiRequest(`/feedback/${encodeURIComponent(feedbackId)}`, { method: "DELETE" });
