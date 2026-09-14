const test = require("node:test");
const assert = require("node:assert/strict");
const { chat } = require("../controllers/chatController");

const callChat = async (body) => {
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  await chat({ body }, response);
  return response;
};

test("chat rejects a missing user message", async () => {
  const response = await callChat({ messages: [] });

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.success, false);
});

test("chat uses the safe local fallback when no provider is configured", async () => {
  const previous = {
    url: process.env.AI_API_URL,
    key: process.env.AI_API_KEY,
    model: process.env.AI_MODEL,
  };

  delete process.env.AI_API_URL;
  delete process.env.AI_API_KEY;
  delete process.env.AI_MODEL;

  try {
    const response = await callChat({
      messages: [{ role: "user", content: "Someone asked me for my OTP." }],
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.payload.success, true);
    assert.equal(response.payload.provider, "CyberRakshak safety fallback");
    assert.match(response.payload.reply, /OTP/i);
  } finally {
    if (previous.url === undefined) delete process.env.AI_API_URL;
    else process.env.AI_API_URL = previous.url;
    if (previous.key === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous.key;
    if (previous.model === undefined) delete process.env.AI_MODEL;
    else process.env.AI_MODEL = previous.model;
  }
});

test("chat rejects an oversized message", async () => {
  const response = await callChat({
    messages: [{ role: "user", content: "x".repeat(2001) }],
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.success, false);
  assert.equal(response.payload.message, "Message is too long");
});

test("the Express application loads all registered routes", () => {
  const app = require("../server");
  assert.equal(typeof app, "function");
});
