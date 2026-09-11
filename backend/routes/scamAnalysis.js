const express = require("express");
const { analyzeScamText, analyzeUrl } = require("../services/riskEngine");

const router = express.Router();

const requireString = (value, field, maxLength) => {
  if (typeof value !== "string" || !value.trim()) {
    const error = new Error(`${field} is required`);
    error.status = 400;
    throw error;
  }
  if (value.length > maxLength) {
    const error = new Error(`${field} must not exceed ${maxLength} characters`);
    error.status = 400;
    throw error;
  }
  return value.trim();
};

router.post("/analyze", (req, res, next) => {
  try {
    const text = requireString(req.body?.text, "text", 12000);
    res.json(analyzeScamText(text));
  } catch (error) {
    next(error);
  }
});

router.post("/analyze-url", (req, res, next) => {
  try {
    const url = requireString(req.body?.url, "url", 2000);
    const result = analyzeUrl(url);
    if (!result.success) return res.status(400).json(result);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/categories", (_req, res) => {
  res.json({
    success: true,
    categories: [
      { id: "phishing", label: "Phishing & Smishing", icon: "🎣" },
      { id: "upi-fraud", label: "UPI & Payment Fraud", icon: "💳" },
      { id: "digital-arrest", label: "Digital Arrest", icon: "🚨" },
      { id: "fake-job", label: "Fake Job Scams", icon: "💼" },
      { id: "sim-swap", label: "SIM & Telecom Safety", icon: "📱" },
      { id: "identity-impersonation", label: "Identity Impersonation", icon: "🪪" },
      { id: "investment-fraud", label: "Investment Scams", icon: "📈" },
      { id: "social-media", label: "Social Media Scams", icon: "💬" }
    ]
  });
});

module.exports = router;
