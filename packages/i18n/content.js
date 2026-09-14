const SUPPORTED_LANGUAGES = ["en", "te"];
const DEFAULT_LANGUAGE = "en";

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(String(language || "").toLowerCase())
    ? String(language).toLowerCase()
    : DEFAULT_LANGUAGE;
}

function localizedValue(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const selected = value[normalizeLanguage(language)] ?? value[DEFAULT_LANGUAGE];
    return selected ?? "";
  }
  return value ?? "";
}

function localizedArray(value, language) {
  const selected = localizedValue(value, language);
  return Array.isArray(selected) ? selected : [];
}

function localizeLesson(module, language) {
  if (!module) return null;
  return {
    ...module,
    title: localizedValue(module.title, language),
    scenario: localizedValue(module.scenario, language),
    redFlags: localizedArray(module.redFlags, language),
    safeAction: localizedValue(module.safeAction, language),
    checkQuestion: localizedValue(module.checkQuestion, language),
    answers: localizedArray(module.answers, language),
  };
}

module.exports = {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
  localizedValue,
  localizedArray,
  localizeLesson,
};
