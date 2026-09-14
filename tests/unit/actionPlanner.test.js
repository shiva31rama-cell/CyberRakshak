const test = require("node:test");
const assert = require("node:assert/strict");

const { createActionPlan } = require("../../services/risk-engine/actionPlanner");

test("creates a critical action plan", () => {
  const result = createActionPlan({
    riskLevel: "critical",
    categories: ["payment_fraud"],
    inputType: "text",
  });

  assert.equal(result.priority, "critical");
  assert.ok(result.steps.some((step) => step.includes("Do not send money")));
  assert.ok(result.steps.some((step) => step.includes("financial institution")));
  assert.ok(result.disclaimer.includes("does not certify"));
});

test("creates an unknown-input action plan", () => {
  const result = createActionPlan({
    riskLevel: "unknown",
    categories: [],
    inputType: "text",
  });

  assert.equal(result.priority, "unknown");
  assert.ok(result.steps.some((step) => step.includes("not enough content")));
});

test("adds malicious-app guidance for notification analysis", () => {
  const result = createActionPlan({
    riskLevel: "high",
    categories: [],
    inputType: "notification",
  });

  assert.ok(result.steps.some((step) => step.includes("Do not install")));
});
