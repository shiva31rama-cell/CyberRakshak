const { getLearnModules, getLearnModule, getLearnCategories } = require("../../services/content/learnCatalog");

describe("learn catalog", () => {
  test("loads structured modules", () => {
    const modules = getLearnModules();
    expect(modules.length).toBeGreaterThanOrEqual(4);
    expect(modules[0]).toHaveProperty("redFlags");
    expect(modules[0]).toHaveProperty("safeAction");
    expect(modules[0].language).toBe("en");
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

  test("returns Telugu lesson content", () => {
    const module = getLearnModule("upi-collect-request", "te");
    expect(module.language).toBe("te");
    expect(module.title).toContain("చెల్లింపు");
    expect(module.safeAction).toContain("UPI PIN");
    expect(module.answers.some((answer) => answer.correct)).toBe(true);
  });

  test("falls back to English for unsupported language", () => {
    const module = getLearnModule("phishing-urgency", "hi");
    expect(module.language).toBe("en");
    expect(module.title).toMatch(/Urgency/i);
  });

  test("exposes unique categories", () => {
    const categories = getLearnCategories();
    expect(categories).toEqual(expect.arrayContaining(["payments", "mobile", "ai-scams", "messages"]));
  });
});
