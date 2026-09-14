const { getLearnModules, getLearnModule, getLearnCategories } = require("../../services/content/learnCatalog");

describe("learn catalog", () => {
  test("loads structured modules", () => {
    const modules = getLearnModules();
    expect(modules.length).toBeGreaterThanOrEqual(4);
    expect(modules[0]).toHaveProperty("redFlags");
    expect(modules[0]).toHaveProperty("safeAction");
  });

  test("filters by category", () => {
    const modules = getLearnModules({ category: "payments" });
    expect(modules.length).toBeGreaterThan(0);
    expect(modules.every((item) => item.category === "payments")).toBe(true);
  });

  test("returns a module by id", () => {
    const module = getLearnModule("malicious-apk");
    expect(module.title).toMatch(/APK/i);
    expect(module.answers.some((answer) => answer.correct)).toBe(true);
  });

  test("exposes unique categories", () => {
    const categories = getLearnCategories();
    expect(categories).toEqual(expect.arrayContaining(["payments", "mobile", "ai-scams", "messages"]));
  });
});
