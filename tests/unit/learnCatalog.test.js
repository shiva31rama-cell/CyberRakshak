const test = require("node:test");
const assert = require("node:assert/strict");
const { getLearnModules, getLearnModule, getLearnCategories } = require("../../services/content/learnCatalog");

test("loads structured modules", () => {
  const modules = getLearnModules();
  assert.ok(modules.length >= 4);
  assert.ok(Object.prototype.hasOwnProperty.call(modules[0], "redFlags"));
  assert.ok(Object.prototype.hasOwnProperty.call(modules[0], "safeAction"));
  assert.equal(modules[0].language, "en");
});

test("filters by category", () => {
  const modules = getLearnModules({ category: "payments" });
  assert.ok(modules.length > 0);
  assert.equal(modules.every((item) => item.category === "payments"), true);
});

test("returns a module by id", () => {
  const module = getLearnModule("malicious-apk");
  assert.match(module.title, /APK/i);
  assert.equal(module.answers.some((answer) => answer.correct), true);
});

test("returns Telugu lesson content", () => {
  const module = getLearnModule("upi-collect-request", "te");
  assert.equal(module.language, "te");
  assert.match(module.title, /చెల్లింపు/);
  assert.match(module.safeAction, /UPI PIN/);
  assert.equal(module.answers.some((answer) => answer.correct), true);
});

test("falls back to English for unsupported language", () => {
  const module = getLearnModule("phishing-urgency", "hi");
  assert.equal(module.language, "en");
  assert.match(module.title, /Urgency/i);
});

test("exposes unique categories", () => {
  const categories = getLearnCategories();
  for (const category of ["payments", "mobile", "ai-scams", "messages"]) assert.ok(categories.includes(category));
});
