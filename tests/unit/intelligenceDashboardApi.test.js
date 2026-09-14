const test = require("node:test");
const assert = require("node:assert/strict");
const router = require("../../backend/routes/intelligence");

test("Intelligence dashboard API exposes feed and health endpoints", () => {
  assert.equal(typeof router, "function");
  assert.ok(Array.isArray(router.stack));
  assert.ok(router.stack.some((layer) => layer.route?.path === "/feeds"));
  assert.ok(router.stack.some((layer) => layer.route?.path === "/health"));
});

test("Intelligence feed and health endpoints are read-only GET routes", () => {
  const methods = router.stack
    .filter((layer) => layer.route)
    .flatMap((layer) => Object.keys(layer.route.methods));
  assert.ok(methods.length >= 2);
  assert.ok(methods.every((method) => method === "get"));
});
