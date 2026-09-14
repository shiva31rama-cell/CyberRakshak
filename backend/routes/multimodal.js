const express = require("express");
const { analyzeImage, MAX_IMAGE_BYTES, ALLOWED_IMAGE_TYPES } = require("../../services/ai/multimodalService");

const router = express.Router();
const MAX_BASE64_LENGTH = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 100;

router.post("/image", async (req, res, next) => {
  try {
    const { imageBase64, mimeType, extractedText = "", allowCloudAnalysis = false } = req.body || {};
    if (typeof imageBase64 !== "string" || imageBase64.length === 0) return res.status(400).json({ success: false, error: "imageBase64 is required" });
    if (imageBase64.length > MAX_BASE64_LENGTH) return res.status(413).json({ success: false, error: "Encoded image exceeds the 2 MB limit" });
    if (!ALLOWED_IMAGE_TYPES.has(mimeType)) return res.status(415).json({ success: false, error: "Only JPEG, PNG and WebP images are supported" });
    if (typeof extractedText !== "string" || extractedText.length > 12000) return res.status(400).json({ success: false, error: "extractedText is invalid" });
    if (typeof allowCloudAnalysis !== "boolean") return res.status(400).json({ success: false, error: "allowCloudAnalysis must be a boolean" });

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64) || cleanBase64.length % 4 === 1) {
      return res.status(400).json({ success: false, error: "Invalid image encoding" });
    }
    const image = Buffer.from(cleanBase64, "base64");
    if (image.length > MAX_IMAGE_BYTES) return res.status(413).json({ success: false, error: "Decoded image exceeds the 2 MB limit" });

    const result = await analyzeImage({ image, mimeType, extractedText, allowCloudAnalysis });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
