const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const express = require("express");
const request = require("supertest");
const router = require("../routes/juryDemo");

test("jury demo API: health-independent media and resource catalogues return honest empty live records", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  const media = await request(app).get("/api/public/media").expect(200);
  const resources = await request(app).get("/api/public/resources").expect(200);
  assert.equal(media.body.mode, "live");
  assert.deepEqual(media.body.items, []);
  assert.equal(resources.body.mode, "live");
  assert.deepEqual(resources.body.items, []);
});

test("jury demo API: payment comparison requires authentication", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  await request(app).post("/api/payment-instructions/compare").send({
    referenceId: "CRK-PAY-DEMO-01", beneficiary: "DEMO CAMPUS OFFICE", amount: "1000",
  }).expect(401);
});

test("jury demo API: AI adapter rejects empty message before calling the chat provider", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  await request(app).post("/api/ai/assist").send({ message: "  " }).expect(400);
});

test("jury demo API: incident intake rejects missing consent and does not create a reference", async () => {
  const auth = require("../middleware/auth");
  const original = auth.protect;
  auth.protect = (req, res, next) => { req.user = { id: "synthetic-user" }; next(); };
  try {
    delete require.cache[require.resolve("../routes/juryDemo")];
    const freshRouter = require("../routes/juryDemo");
    const app = express();
    app.use(express.json());
    app.use("/api", freshRouter);
    await request(app).post("/api/incident-intake").send({
      description: "A synthetic incident with enough detail", consent: false,
    }).expect(400);
  } finally {
    auth.protect = original;
  }
});

test("jury demo API: incident intake returns a transient reference but does not claim persistence", async () => {
  const auth = require("../middleware/auth");
  const original = auth.protect;
  auth.protect = (req, res, next) => { req.user = { id: "synthetic-user" }; next(); };
  try {
    delete require.cache[require.resolve("../routes/juryDemo")];
    const freshRouter = require("../routes/juryDemo");
    const app = express();
    app.use(express.json());
    app.use("/api", freshRouter);
    const result = await request(app).post("/api/incident-intake").send({
      description: "A synthetic suspicious message was received yesterday.",
      consent: true,
    }).expect(202);
    assert.match(result.body.referenceId, /^CRK-[A-F0-9]{16}$/);
    assert.equal(result.body.persisted, false);
    assert.equal(result.body.status, "RECEIVED_TRANSIENT");
  } finally {
    auth.protect = original;
  }
});

test("jury demo API: analysis accepts message type and rejects unknown type", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  const result = await request(app).post("/api/analyze").send({
    type: "message", input: "Your account is blocked. Verify your account immediately using this link.",
  }).expect(200);
  assert.equal(typeof result.body.riskLevel, "string");
  assert.equal(Array.isArray(result.body.indicators), true);
  await request(app).post("/api/analyze").send({ type: "unknown", input: "x" }).expect(400);
});

test("jury demo API: invalid input does not return success", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  await request(app).post("/api/analyze").send({ type: "url", input: "" }).expect(400);
});
