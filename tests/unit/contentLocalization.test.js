const {
  normalizeLanguage,
  localizedValue,
  localizedArray,
  localizeLesson,
} = require("../../packages/i18n/content");

describe("shared content localization", () => {
  test("normalizes supported and unsupported languages", () => {
    expect(normalizeLanguage("te")).toBe("te");
    expect(normalizeLanguage("EN")).toBe("en");
    expect(normalizeLanguage("hi")).toBe("en");
  });

  test("selects localized strings and arrays with English fallback", () => {
    const value = { en: "English", te: "తెలుగు" };
    expect(localizedValue(value, "te")).toBe("తెలుగు");
    expect(localizedValue(value, "hi")).toBe("English");
    expect(localizedArray({ en: ["A"], te: ["అ"] }, "te")).toEqual(["అ"]);
  });

  test("localizes a complete lesson without changing identifiers", () => {
    const lesson = {
      id: "demo",
      category: "payments",
      title: { en: "Title", te: "శీర్షిక" },
      scenario: { en: "Scenario", te: "పరిస్థితి" },
      redFlags: { en: ["Flag"], te: ["సంకేతం"] },
      safeAction: { en: "Verify", te: "ధృవీకరించండి" },
      checkQuestion: { en: "Question?", te: "ప్రశ్న?" },
      answers: { en: [{ id: "a", text: "Yes", correct: true }], te: [{ id: "a", text: "అవును", correct: true }] },
      sourceIds: ["i4c-ncrp"],
    };

    const localized = localizeLesson(lesson, "te");
    expect(localized.id).toBe("demo");
    expect(localized.sourceIds).toEqual(["i4c-ncrp"]);
    expect(localized.title).toBe("శీర్షిక");
    expect(localized.answers[0].correct).toBe(true);
  });
});
