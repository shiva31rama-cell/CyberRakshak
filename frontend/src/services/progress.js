/** Anonymous learning progress, stored only in this browser. */
const KEY = "cyberrakshak.progress";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };

export const getProgress = () => { const p = read(); return { topics: Array.isArray(p.topics) ? p.topics : [], bestScore: Number.isFinite(p.bestScore) ? p.bestScore : null }; };
export const markTopicRead = (slug) => { const p = getProgress(); if (!p.topics.includes(slug)) write({ ...p, topics: [...p.topics, slug] }); };
export const recordQuizScore = (percent) => { const p = getProgress(); write({ ...p, bestScore: Math.max(p.bestScore ?? 0, percent) }); };
