const test = require("node:test");
const assert = require("node:assert/strict");
const router = require("../../backend/routes/threats");

test("Threat Radar route exports an Express router", () => {
  assert.equal(typeof router, "function");
  assert.ok(Array.isArray(router.stack));
  assert.ok(router.stack.some((layer) => layer.route?.path === "/"));
  assert.ok(router.stack.some((layer) => layer.route?.path === "/:id"));
});
