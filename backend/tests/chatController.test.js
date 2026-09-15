const test = require("node:test");
const assert = require("node:assert/strict");
const { chat } = require("../controllers/chatController");

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

test("chat returns a safe fallback when AI configuration is missing", async () => {
  const original = {
    key: process.env.AI_API_KEY,
    url: process.env.AI_API_URL,
    model: process.env.AI_MODEL,
  };
  delete process.env.AI_API_KEY;
  delete process.env.AI_API_URL;
  delete process.env.AI_MODEL;

  const result = await callChat({
    messages: [{ role: "user", content: "How do I stay safe from phishing?" }],
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.success, true);
  assert.match(result.payload.reply, /phishing/i);
  assert.equal(result.payload.provider, "CyberRakshak safety fallback");

  if (original.key !== undefined) process.env.AI_API_KEY = original.key;
  if (original.url !== undefined) process.env.AI_API_URL = original.url;
  if (original.model !== undefined) process.env.AI_MODEL = original.model;
});

test("chat handles a normal greeting conversationally", async () => {
  const result = await callChat({
    messages: [{ role: "user", content: "Hi, how are you?" }],
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.success, true);
  assert.match(result.payload.reply, /CyberRakshak/i);
  assert.match(result.payload.reply, /cyber safety/i);
});

test("chat redirects clearly unrelated questions back to CyberRakshak scope", async () => {
  const result = await callChat({
    messages: [{ role: "user", content: "What is the best recipe for pizza?" }],
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.success, true);
  assert.equal(result.payload.provider, "CyberRakshak scope guard");
  assert.match(result.payload.reply, /focused on cyber safety/i);
  assert.doesNotMatch(result.payload.reply, /recipe|pizza/i);
});

test("chat keeps vague cyber incidents open for follow-up", async () => {
  const result = await callChat({
    messages: [{ role: "user", content: "I think my phone is hacked" }],
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.success, true);
  assert.match(result.payload.reply, /phone|device/i);
});

test("chat rejects a missing user message", async () => {
  const result = await callChat({ messages: [] });
  assert.equal(result.statusCode, 400);
  assert.equal(result.payload.success, false);
});

test("chat rejects messages over the input limit", async () => {
  const result = await callChat({
    messages: [{ role: "user", content: "x".repeat(2001) }],
  });
  assert.equal(result.statusCode, 400);
  assert.equal(result.payload.success, false);
});
