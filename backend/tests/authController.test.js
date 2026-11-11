const test = require("node:test");
const assert = require("node:assert/strict");
const User = require("../models/User");
const { register } = require("../controllers/authController");

function responseCapture() {
  const result = { statusCode: 200, payload: null };
  return {
    get statusCode() { return result.statusCode; },
    get payload() { return result.payload; },
    response: {
      status(code) {
        result.statusCode = code;
        return this;
      },
      json(payload) {
        result.payload = payload;
        return this;
      },
    },
  };
}

test("registration treats an empty body as a client input error", async () => {
  const result = responseCapture();
  await register({ body: null }, result.response);
  assert.equal(result.statusCode, 400);
  assert.equal(result.payload.success, false);
});

test("registration maps model validation failures to a safe 400 response", async (t) => {
  const originalFindOne = User.findOne;
  const originalCreate = User.create;
  User.findOne = () => ({ select: async () => null });
  User.create = async () => {
    const error = new Error("synthetic invalid email");
    error.name = "ValidationError";
    throw error;
  };
  t.after(() => {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  });

  const result = responseCapture();
  await register({
    body: {
      name: "Synthetic User",
      email: "invalid-example",
      password: "synthetic-password",
      confirmPassword: "synthetic-password",
    },
  }, result.response);

  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.payload, {
    success: false,
    message: "Please check the supplied account details",
  });
  assert.doesNotMatch(JSON.stringify(result.payload), /synthetic invalid email|synthetic-password/i);
});
