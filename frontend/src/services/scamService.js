import { apiRequest } from "./api";

export const submitScamReport = async (reportData) =>
  apiRequest("/scam-report", {
    method: "POST",
    body: JSON.stringify(reportData),
  });

export const getAllScamReports = async () => {
  const data = await apiRequest("/scam-report");
  return data.reports || [];
};

export const getReportByCaseNumber = async (caseNumber) => {
  const data = await apiRequest(
    `/scam-report/case/${encodeURIComponent(caseNumber)}`
  );
  return data.report || null;
};

export const getUserScamReports = async (userId) => {
  const data = await apiRequest(
    `/scam-report/user/${encodeURIComponent(userId)}`
  );
  return data.reports || [];
};

export const updateReportStatus = async (reportId, status) => {
  const data = await apiRequest(`/scam-report/${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.report || data;
};

export const getScamStatistics = async () => {
  const data = await apiRequest("/scam-report/stats/overview");
  return data.statistics || data;
};

export const SCAM_TYPES = [
  "UPI Fraud",
  "Fake Call/SMS",
  "Online Shopping Fraud",
  "Job Scam",
  "Dating Scam",
  "Investment Fraud",
  "Phishing",
  "Tech Support Scam",
  "Prize/Lottery Scam",
  "Government Impersonation",
  "Banking Fraud",
  "Insurance Scam",
  "Other",
];
