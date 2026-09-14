const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("../../backend/server");

const startTestServer = () => new Promise((resolve) => {
  const server = http.createServer(app);
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
  });
});

test("POST /api/analyze returns a structured safety assessment", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      inputType: "message",
      text: "Urgent: send your OTP immediately to verify your account.",
    }),
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.ok(body.assessment.score > 0);
  assert.ok(Array.isArray(body.assessment.reasons));
  assert.deepEqual(body.privacy, { mode: "local-first", serverStored: false });
});

test("POST /api/analyze rejects unsupported input types", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inputType: "camera_magic", text: "hello" }),
  });

  assert.equal(response.status, 400);
});

test("POST /api/analyze rejects oversized text", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inputType: "text", text: "x".repeat(12001) }),
  });

  assert.equal(response.status, 413);
});
