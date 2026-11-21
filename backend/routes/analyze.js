const express = require("express");
const { analyzeMessage } = require("../../shared/analyzer/messageAnalyzer.mjs");

const router = express.Router();

/**
 * POST /api/analyze  { message: string }
 * Runs the transparent rule-based analyser. The message is NOT stored or logged.
 */
router.post("/", (req, res) => {
  const message = req.body?.message;
  if (typeof message !== "string") return res.status(400).json({ success: false, message: "Field 'message' must be a string" });
  const result = analyzeMessage(message);
  if (!result.ok) {
    const text = result.error === "too_long" ? "Message is too long (max 5000 characters)" : "Message cannot be empty";
    return res.status(400).json({ success: false, message: text });
  }
  res.set("Cache-Control", "no-store");
  return res.json({ success: true, result });
});

module.exports = router;
