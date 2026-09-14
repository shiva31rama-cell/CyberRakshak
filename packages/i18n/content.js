const SUPPORTED_LANGUAGES = ["en", "te"];
const DEFAULT_LANGUAGE = "en";

function normalizeLanguage(language) {
  const value = String(language || "").trim().toLowerCase();
  return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
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

function localizeLesson(module, language = DEFAULT_LANGUAGE) {
  if (!module) return null;
  const selectedLanguage = normalizeLanguage(language);
  const envelope = module[selectedLanguage] || module[DEFAULT_LANGUAGE] || {};
  return {
    id: module.id,
    category: module.category,
    severity: module.severity,
    durationMinutes: module.durationMinutes,
    sourceIds: Array.isArray(module.sourceIds) ? [...module.sourceIds] : [],
    language: selectedLanguage,
    title: localizedValue(module.title ?? envelope.title, selectedLanguage),
    scenario: localizedValue(module.scenario ?? envelope.scenario, selectedLanguage),
    redFlags: localizedArray(module.redFlags ?? envelope.redFlags, selectedLanguage),
    safeAction: localizedValue(module.safeAction ?? envelope.safeAction, selectedLanguage),
    checkQuestion: localizedValue(module.checkQuestion ?? envelope.checkQuestion, selectedLanguage),
    answers: localizedArray(module.answers ?? envelope.answers, selectedLanguage),
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
