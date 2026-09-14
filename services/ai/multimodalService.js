const { analyze } = require("../risk-engine/analysisOrchestrator");
const { redactSensitiveData } = require("./safetyPrompt");

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const fallback = ({ inputType, extractedText = "" }) => {
  const assessment = analyze({ text: extractedText, inputType: extractedText ? "message" : "text" });
  return {
    assessment,
    visualAnalysis: {
      status: "manual-review",
      message: extractedText
        ? "The extracted text was checked locally. Visual AI analysis is unavailable until a vision-capable model is configured."
        : "The image was received, but visual AI analysis is unavailable until a vision-capable model is configured.",
    },
  };
};

const analyzeImage = async ({ image, mimeType, extractedText = "" }) => {
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) throw Object.assign(new Error("Unsupported image type"), { status: 415 });
  if (!Buffer.isBuffer(image) || image.length === 0) throw Object.assign(new Error("Image is required"), { status: 400 });
  if (image.length > MAX_IMAGE_BYTES) throw Object.assign(new Error("Image exceeds the 2 MB limit"), { status: 413 });

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_VISION_MODEL) return fallback({ inputType: "image", extractedText });

  const safeText = redactSensitiveData(extractedText);
  const dataUrl = `data:${mimeType};base64,${image.toString("base64")}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL,
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: `Defensive cyber-safety image review. Identify visible scam/phishing/payment/social-engineering warning signs. Never request secrets. Do not claim certainty. Return concise JSON with keys: summary, warningSigns, safeNextSteps, confidenceNote. Extracted text, if any: ${safeText}` },
            { type: "input_image", image_url: dataUrl },
          ],
        }],
        max_output_tokens: 500,
      }),
      signal: controller.signal,
    });
    if (!response.ok) return fallback({ inputType: "image", extractedText });
    const payload = await response.json();
    const output = typeof payload.output_text === "string" ? payload.output_text : "";
    let parsed = null;
    try { parsed = JSON.parse(output.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")); } catch { parsed = null; }
    if (!parsed?.summary) return fallback({ inputType: "image", extractedText });
    const assessment = analyze({ text: extractedText, inputType: extractedText ? "message" : "text" });
    return {
      assessment,
      visualAnalysis: {
        status: "ai-assisted",
        message: String(parsed.summary).slice(0, 1200),
        warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns.slice(0, 8) : [],
        safeNextSteps: Array.isArray(parsed.safeNextSteps) ? parsed.safeNextSteps.slice(0, 8) : [],
        confidenceNote: typeof parsed.confidenceNote === "string" ? parsed.confidenceNote.slice(0, 500) : "AI-assisted visual review; not a guarantee of safety.",
      },
    };
  } catch {
    return fallback({ inputType: "image", extractedText });
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { analyzeImage, MAX_IMAGE_BYTES, ALLOWED_IMAGE_TYPES };
