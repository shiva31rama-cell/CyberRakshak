const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const errors = [];

const readJson = (relativePath) => {
  const file = path.join(ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
};

const requireString = (value, label) => {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label}: required non-empty string`);
};

const validateLearn = () => {
  const modules = readJson("data/content/learn-modules.json");
  if (!Array.isArray(modules)) {
    errors.push("data/content/learn-modules.json: expected an array");
    return;
  }

  const ids = new Set();
  for (const module of modules) {
    requireString(module.id, "learn.id");
    if (ids.has(module.id)) errors.push(`learn.${module.id}: duplicate id`);
    ids.add(module.id);
    requireString(module.category, `learn.${module.id}.category`);
    requireString(module.severity, `learn.${module.id}.severity`);
    if (!Number.isInteger(module.durationMinutes) || module.durationMinutes < 1) errors.push(`learn.${module.id}.durationMinutes: expected positive integer`);
    if (!Array.isArray(module.sourceIds) || module.sourceIds.length === 0) errors.push(`learn.${module.id}.sourceIds: expected at least one source id`);

    if (!module.en || typeof module.en !== "object") {
      errors.push(`learn.${module.id}: missing English content`);
      continue;
    }
    for (const field of ["title", "scenario", "safeAction", "checkQuestion"]) requireString(module.en[field], `learn.${module.id}.en.${field}`);
    if (!Array.isArray(module.en.redFlags) || module.en.redFlags.length === 0) errors.push(`learn.${module.id}.en.redFlags: expected non-empty array`);
    if (!Array.isArray(module.en.answers) || module.en.answers.length < 2) errors.push(`learn.${module.id}.en.answers: expected at least two answers`);
    if (module.te) {
      for (const field of ["title", "scenario", "safeAction", "checkQuestion"]) requireString(module.te[field], `learn.${module.id}.te.${field}`);
      if (!Array.isArray(module.te.redFlags) || module.te.redFlags.length === 0) errors.push(`learn.${module.id}.te.redFlags: expected non-empty array`);
      if (!Array.isArray(module.te.answers) || module.te.answers.length < 2) errors.push(`learn.${module.id}.te.answers: expected at least two answers`);
    }

    const correctAnswers = (module.en.answers || []).filter((answer) => answer.correct === true);
    if (correctAnswers.length !== 1) errors.push(`learn.${module.id}.en.answers: expected exactly one correct answer`);
    if (module.te) {
      const teCorrect = module.te.answers.filter((answer) => answer.correct === true);
      if (teCorrect.length !== 1) errors.push(`learn.${module.id}.te.answers: expected exactly one correct answer`);
    }
  }
};

const validateThreats = () => {
  const directory = path.join(ROOT, "data/threats");
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".json") && entry.name !== "schema.json") files.push(full);
    }
  };
  walk(directory);

  const ids = new Set();
  for (const file of files) {
    const relative = path.relative(ROOT, file);
    const parsed = readJson(relative);
    const records = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.records) ? parsed.records : parsed ? [parsed] : [];
    for (const record of records) {
      requireString(record.id, `${relative}.id`);
      if (ids.has(record.id)) errors.push(`${relative}.${record.id}: duplicate id`);
      ids.add(record.id);
      requireString(record.title, `${relative}.${record.id}.title`);
      const category = record.category || record.categories?.[0];
      requireString(category, `${relative}.${record.id}.category`);
      if (!record.severity) errors.push(`${relative}.${record.id}.severity: required`);
      if (!Array.isArray(record.sources || record.sourceReferences) || (record.sources || record.sourceReferences).length === 0) errors.push(`${relative}.${record.id}: expected source provenance`);
    }
  }
};

validateLearn();
validateThreats();

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Content validation passed: Learn and threat records satisfy the deterministic quality gate.");
