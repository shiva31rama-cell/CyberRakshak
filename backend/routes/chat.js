const express = require("express");
const rateLimit = require("express-rate-limit");
const { chat, MAX_MESSAGES, MAX_MESSAGE_LENGTH } = require("../services/chatService");

const router = express.Router();

const burstLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many AI requests. Please wait a moment and try again." },
});

const allowedLanguages = new Set(["English", "Telugu", "Hindi"]);
const allowedAgeGroups = new Set(["", "teen", "young-adult", "adult", "senior"]);

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-MAX_MESSAGES).map((message) => ({
    role: message?.role === "assistant" ? "assistant" : "user",
    content: String(message?.content || "").trim().slice(0, MAX_MESSAGE_LENGTH),
  })).filter((message) => message.content);
}

router.post("/", burstLimiter, async (req, res, next) => {
  try {
    const messages = cleanMessages(req.body?.messages);
    const language = allowedLanguages.has(req.body?.language) ? req.body.language : "English";
    const ageGroup = allowedAgeGroups.has(req.body?.ageGroup) ? req.body.ageGroup : "";
    const previousInteractionId = typeof req.body?.previousInteractionId === "string"
      ? req.body.previousInteractionId.slice(0, 200)
      : null;

    if (!messages.length) {
      return res.status(400).json({ success: false, message: "A conversation message is required." });
    }

    const result = await chat({ messages, language, ageGroup, previousInteractionId });

    return res.json({
      success: true,
      reply: result.reply,
      provider: result.provider,
      model: result.model,
      interactionId: result.interactionId,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/status", (_req, res) => {
  res.json({
    success: true,
    providerMode: process.env.AI_PROVIDER || "auto",
    primaryConfigured: Boolean(process.env.GEMINI_API_KEY),
    fallbackConfigured: Boolean(process.env.OPENROUTER_API_KEY),
    deterministicFallback: true,
  });
});

module.exports = router;
