const assert = require("node:assert/strict");
const { getRecoveryPlan, getRecoveryScenarios } = require("../../services/incidents/recoveryPlans");

describe("incident recovery plans", () => {
  it("returns all supported scenarios", () => {
    const scenarios = getRecoveryScenarios();
    assert.equal(scenarios.length, 6);
    assert.ok(scenarios.some((item) => item.id === "paid" && item.urgency === "critical"));
  });

  it("prioritizes financial fraud recovery", () => {
    const plan = getRecoveryPlan("paid");
    assert.equal(plan.urgency, "critical");
    assert.ok(plan.immediate.some((step) => step.includes("1930")));
    assert.ok(plan.resources.some((resource) => resource.url === "https://www.cybercrime.gov.in/"));
  });

  it("does not expose plans for unknown scenarios", () => {
    assert.equal(getRecoveryPlan("unknown"), null);
  });
});
