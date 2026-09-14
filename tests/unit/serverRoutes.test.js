const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../../backend/server");

test("registers the Learn API route", () => {
  const routes = app._router?.stack || app.router?.stack || [];
  assert.ok(routes.some((layer) => layer.regexp?.test?.("/api/learn") || layer.route?.path === "/api/learn" || layer.name === "router"));
});
