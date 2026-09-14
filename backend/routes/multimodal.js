const express = require("express");
const { analyzeImage, MAX_IMAGE_BYTES, ALLOWED_IMAGE_TYPES } = require("../../services/ai/multimodalService");

const router = express.Router();
const MAX_BASE64_LENGTH = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 100;

router.post("/image", async (req, res, next) => {
  try {
    const { imageBase64, mimeType, extractedText = "" } = req.body || {};
    if (typeof imageBase64 !== "string" || imageBase64.length === 0) return res.status(400).json({ success: false, error: "imageBase64 is required" });
    if (imageBase64.length > MAX_BASE64_LENGTH) return res.status(413).json({ success: false, error: "Encoded image exceeds the 2 MB limit" });
    if (!ALLOWED_IMAGE_TYPES.has(mimeType)) return res.status(415).json({ success: false, error: "Only JPEG, PNG and WebP images are supported" });
    if (typeof extractedText !== "string" || extractedText.length > 12000) return res.status(400).json({ success: false, error: "extractedText is invalid" });

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) return res.status(400).json({ success: false, error: "Invalid image encoding" });
    const image = Buffer.from(cleanBase64, "base64");
    const result = await analyzeImage({ image, mimeType, extractedText });

    res.json({ success: true, ...result, privacy: { serverStored: false, sensitiveDataRedaction: true } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
