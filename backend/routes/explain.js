const express = require("express");
const { analyze } = require("../../services/risk-engine/analysisOrchestrator");
const { explainAssessment } = require("../../services/ai/explanationService");

const router = express.Router();

const ALLOWED_INPUT_TYPES = new Set([
  "text",
  "message",
  "url",
  "phone",
  "upi",
  "email",
  "notification",
  "qr_payload",
]);

const MAX_TEXT_LENGTH = 12000;

router.post("/", async (req, res, next) => {
  try {
    const { text, inputType = "text" } = req.body || {};

    if (typeof text !== "string") {
      return res.status(400).json({ success: false, error: "text must be a string" });
    }

    if (!ALLOWED_INPUT_TYPES.has(inputType)) {
      return res.status(400).json({
        success: false,
        error: "Unsupported inputType",
        allowedInputTypes: [...ALLOWED_INPUT_TYPES],
      });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        success: false,
        error: `text exceeds the ${MAX_TEXT_LENGTH}-character limit`,
      });
    }

    const assessment = analyze({ text, inputType });
    const explanation = await explainAssessment({ text, inputType, assessment });

    return res.json({
      success: true,
      assessment,
      explanation,
      privacy: {
        mode: "local-first",
        serverStored: false,
        sensitiveDataRedaction: true,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
