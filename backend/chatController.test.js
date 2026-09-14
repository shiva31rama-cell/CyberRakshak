const test = require("node:test");
const assert = require("node:assert/strict");
const { chat } = require("./controllers/chatController");

const callChat = async (body) => {
  const result = { statusCode: 200, payload: null };
  const res = {
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(payload) {
      result.payload = payload;
      return this;
    },
  };

  await chat({ body }, res);
  return result;
};

test("rejects a missing chat message", async () => {
  const result = await callChat({ messages: [] });
  assert.equal(result.statusCode, 400);
  assert.equal(result.payload.success, false);
});

test("rejects an oversized latest user message", async () => {
  const result = await callChat({
    messages: [{ role: "user", content: "x".repeat(2001) }],
  });
  assert.equal(result.statusCode, 400);
  assert.equal(result.payload.message, "Message is too long");
});

test("returns safe OTP guidance without an AI provider", async () => {
  const previous = {
    key: process.env.AI_API_KEY,
    url: process.env.AI_API_URL,
    model: process.env.AI_MODEL,
  };

  delete process.env.AI_API_KEY;
  delete process.env.AI_API_URL;
  delete process.env.AI_MODEL;

  try {
    const result = await callChat({
      messages: [{ role: "user", content: "Someone is asking me for my OTP" }],
    });
    assert.equal(result.statusCode, 200);
    assert.equal(result.payload.success, true);
    assert.match(result.payload.reply, /Never share an OTP/i);
    assert.equal(result.payload.provider, "CyberRakshak safety fallback");
  } finally {
    if (previous.key === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous.key;
    if (previous.url === undefined) delete process.env.AI_API_URL;
    else process.env.AI_API_URL = previous.url;
    if (previous.model === undefined) delete process.env.AI_MODEL;
    else process.env.AI_MODEL = previous.model;
  }
});

test("loads the complete Express application without starting the server", () => {
  const app = require("./server");
  assert.equal(typeof app, "function");
});
