const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeImage } = require("../../services/ai/multimodalService");

test("multimodal analysis never calls cloud AI without explicit consent", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_VISION_MODEL;
  process.env.OPENAI_API_KEY = "test-key";
  process.env.OPENAI_VISION_MODEL = "test-vision-model";
  let calls = 0;
  try {
    const result = await analyzeImage({
      image: Buffer.from("safe-test-image"),
      mimeType: "image/png",
      extractedText: "Urgent payment verification",
      allowCloudAnalysis: false,
      fetchImpl: async () => { calls += 1; throw new Error("cloud call must not happen"); },
    });
    assert.equal(calls, 0);
    assert.equal(result.visualAnalysis.status, "manual-review");
    assert.equal(result.privacy.cloudAnalysis, false);
    assert.equal(result.privacy.serverStored, false);
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_VISION_MODEL;
    else process.env.OPENAI_VISION_MODEL = originalModel;
  }
});

test("multimodal analysis can use cloud AI only after consent", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_VISION_MODEL;
  process.env.OPENAI_API_KEY = "test-key";
  process.env.OPENAI_VISION_MODEL = "test-vision-model";
  let calls = 0;
  try {
    const result = await analyzeImage({
      image: Buffer.from("safe-test-image"),
      mimeType: "image/png",
      extractedText: "Suspicious message",
      allowCloudAnalysis: true,
      fetchImpl: async () => {
        calls += 1;
        return {
          ok: true,
          json: async () => ({
            output_text: JSON.stringify({
              summary: "The image contains warning signs.",
              warningSigns: ["Urgency"],
              safeNextSteps: ["Do not pay"],
              confidenceNote: "AI-assisted review; not a guarantee.",
            }),
          }),
        };
      },
    });
    assert.equal(calls, 1);
    assert.equal(result.visualAnalysis.status, "ai-assisted");
    assert.equal(result.privacy.cloudAnalysis, true);
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_VISION_MODEL;
    else process.env.OPENAI_VISION_MODEL = originalModel;
  }
});
