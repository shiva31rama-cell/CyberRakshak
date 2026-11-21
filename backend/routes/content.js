const express = require("express");
const { THREATS, getThreat } = require("../../shared/content/threats.mjs");
const { VIDEOS } = require("../../shared/content/videos.mjs");
const { buildQuiz, QUIZ_BANK } = require("../../shared/content/quiz.mjs");

const router = express.Router();
const LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const COUNTS = new Set([5, 10, 15, 20]);

// GET /api/content/threats?q=
router.get("/threats", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 100) : "";
  const list = THREATS.filter((t) => !q || [t.title.en, t.title.te, t.summary.en, t.summary.te].some((s) => s.toLowerCase().includes(q)));
  res.json({ success: true, count: list.length, threats: list });
});

// GET /api/content/threats/:slug
router.get("/threats/:slug", (req, res) => {
  const threat = /^[a-z0-9-]{1,60}$/.test(req.params.slug) ? getThreat(req.params.slug) : null;
  if (!threat) return res.status(404).json({ success: false, message: "Topic not found" });
  res.json({ success: true, threat });
});

// GET /api/content/videos?lang=en|te&category=
router.get("/videos", (req, res) => {
  const { lang, category } = req.query;
  const list = VIDEOS.filter((v) => (!lang || v.lang === lang) && (!category || v.category === category)).map((v) => ({ ...v, url: `https://www.youtube.com/watch?v=${v.id}` }));
  res.json({ success: true, count: list.length, videos: list });
});

// GET /api/content/quiz?difficulty=beginner&count=10  (answers stripped)
router.get("/quiz", (req, res) => {
  const difficulty = LEVELS.has(req.query.difficulty) ? req.query.difficulty : "beginner";
  const count = COUNTS.has(Number(req.query.count)) ? Number(req.query.count) : 5;
  const questions = buildQuiz(difficulty, count).map((q) => ({ id: q.id, difficulty: q.difficulty, topic: q.topic, question: q.question, options: q.options, order: q.options.en }));
  res.json({ success: true, difficulty, count: questions.length, questions });
});

// POST /api/content/quiz/grade  { answers: [{ id, option: "<english option text>" }] }
router.post("/quiz/grade", (req, res) => {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers.slice(0, 20) : null;
  if (!answers) return res.status(400).json({ success: false, message: "Answers must be an array" });
  const results = answers.map((a) => {
    const q = QUIZ_BANK.find((x) => x.id === String(a?.id));
    if (!q) return { id: String(a?.id).slice(0, 10), valid: false };
    return { id: q.id, valid: true, correct: q.options.en[q.answer] === a.option, topic: q.topic, explanation: q.explanation };
  });
  const valid = results.filter((r) => r.valid);
  const correct = valid.filter((r) => r.correct).length;
  res.json({ success: true, total: valid.length, correct, percent: valid.length ? Math.round((correct / valid.length) * 100) : 0, results });
});

module.exports = router;
