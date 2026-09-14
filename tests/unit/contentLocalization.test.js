const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeLanguage,
  localizedValue,
  localizedArray,
  localizeLesson,
} = require("../../packages/i18n/content");

test("normalizes supported and unsupported languages", () => {
  assert.equal(normalizeLanguage("te"), "te");
  assert.equal(normalizeLanguage("EN"), "en");
  assert.equal(normalizeLanguage("hi"), "en");
});

test("selects localized strings and arrays with English fallback", () => {
  const value = { en: "English", te: "తెలుగు" };
  assert.equal(localizedValue(value, "te"), "తెలుగు");
  assert.equal(localizedValue(value, "hi"), "English");
  assert.deepEqual(localizedArray({ en: ["A"], te: ["అ"] }, "te"), ["అ"]);
});

test("localizes a complete field-based lesson without changing identifiers", () => {
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
  assert.equal(localized.id, "demo");
  assert.deepEqual(localized.sourceIds, ["i4c-ncrp"]);
  assert.equal(localized.title, "శీర్షిక");
  assert.equal(localized.answers[0].correct, true);
});

test("localizes the actual lesson envelope used by Learn content", () => {
  const lesson = {
    id: "demo-envelope",
    category: "mobile",
    severity: "high",
    durationMinutes: 3,
    sourceIds: ["cert-in"],
    en: { title: "English title", scenario: "English scenario", redFlags: ["English flag"], safeAction: "English action", checkQuestion: "English question?", answers: [{ id: "a", text: "English", correct: true }] },
    te: { title: "తెలుగు శీర్షిక", scenario: "తెలుగు పరిస్థితి", redFlags: ["తెలుగు సంకేతం"], safeAction: "తెలుగు చర్య", checkQuestion: "తెలుగు ప్రశ్న?", answers: [{ id: "a", text: "తెలుగు", correct: true }] },
  };

  const localized = localizeLesson(lesson, "te");
  assert.equal(localized.language, "te");
  assert.equal(localized.title, "తెలుగు శీర్షిక");
  assert.deepEqual(localized.redFlags, ["తెలుగు సంకేతం"]);
  assert.equal(localized.answers[0].correct, true);
});
