const test = require("node:test");
const assert = require("node:assert/strict");
const { chat } = require("./chatService");

test("chat returns a deterministic safety fallback when no provider key is configured", async () => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.OPENROUTER_API_KEY;

  try {
    const result = await chat({
      messages: [{ role: "user", content: "Should I share an OTP with a caller?" }],
      language: "English",
      ageGroup: "teen",
    });

    assert.equal(result.provider, "deterministic-fallback");
    assert.match(result.reply, /OTP/i);
    assert.match(result.reply, /Never share/i);
  } finally {
    if (geminiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = geminiKey;
    if (openRouterKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = openRouterKey;
  }
});
