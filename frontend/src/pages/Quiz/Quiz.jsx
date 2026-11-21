import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { buildQuiz, performanceBand, QUIZ_TOPICS } from "../../../../shared/content/quiz.mjs";
import { recordQuizScore } from "../../services/progress";
import Icon from "../../components/Icon/Icon";
import "./Quiz.css";

const LEVELS = ["beginner", "intermediate", "advanced"];
const COUNTS = [5, 10, 15, 20];

function Quiz() {
  const { t, pick } = useLanguage();
  const [level, setLevel] = useState("beginner");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const start = () => { setQuestions(buildQuiz(level, count)); setIndex(0); setAnswers([]); setSelected(null); setDone(false); };
  const restart = () => { setQuestions(null); setDone(false); };

  if (!questions) {
    return (
      <div className="container page">
        <div className="page-head"><span className="eyebrow"><Icon name="quiz" size={14} /> {t("nav.quiz")}</span><h1>{t("quiz.title")}</h1><p>{t("quiz.desc")}</p></div>
        <div className="card quiz-setup">
          <fieldset><legend>{t("quiz.level")}</legend><div className="chips">{LEVELS.map((l) => <button key={l} type="button" className={`chip ${level === l ? "on" : ""}`} aria-pressed={level === l} onClick={() => setLevel(l)}>{t(`quiz.${l}`)}</button>)}</div></fieldset>
          <fieldset><legend>{t("quiz.count")}</legend><div className="chips">{COUNTS.map((c) => <button key={c} type="button" className={`chip ${count === c ? "on" : ""}`} aria-pressed={count === c} onClick={() => setCount(c)}>{c}</button>)}</div></fieldset>
          {count > 8 && <p className="small muted">{t("quiz.fillNote")}</p>}
          <button type="button" className="btn btn-primary" onClick={start}>{t("quiz.start")} <Icon name="arrow" size={18} /></button>
        </div>
      </div>
    );
  }

  if (done) {
    const correct = answers.filter((a) => a.correct).length;
    const total = questions.length;
    const percent = Math.round((correct / total) * 100);
    const weak = [...new Set(answers.filter((a) => !a.correct).map((a) => a.topic))];
    return (
      <div className="container page">
        <div className="card quiz-result fade-in">
          <span className="eyebrow">{t("quiz.result")}</span>
          <div className="quiz-score">{percent}%</div>
          <p className="quiz-band">{t("quiz.performance")}: <strong>{t(`band.${performanceBand(percent)}`)}</strong></p>
          <div className="grid grid-4 quiz-stats">
            <div><span>{t("quiz.total")}</span><strong>{total}</strong></div>
            <div><span>{t("quiz.right")}</span><strong className="lvl-low">{correct}</strong></div>
            <div><span>{t("quiz.incorrect")}</span><strong className="lvl-high">{total - correct}</strong></div>
            <div><span>{t("quiz.performance")}</span><strong>{correct}/{total}</strong></div>
          </div>
          <h3>{t("quiz.improve")}</h3>
          {weak.length === 0 ? <p className="muted">{t("quiz.perfect")}</p> : (
            <>
              <div className="chips" style={{ marginBottom: 16 }}>{weak.map((w) => <span key={w} className="badge sev-high">{pick(QUIZ_TOPICS[w])}</span>)}</div>
              <h3>{t("quiz.resources")}</h3>
              <ul className="check-list">{weak.map((w) => <li key={w}><Icon name="book" size={16} /><Link to={QUIZ_TOPICS[w].link ? `/threats/${QUIZ_TOPICS[w].link}` : "/safety-guide"}>{pick(QUIZ_TOPICS[w])}</Link></li>)}</ul>
            </>
          )}
          <button type="button" className="btn btn-primary" onClick={restart} style={{ marginTop: 16 }}>{t("quiz.restart")}</button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const answered = selected !== null;
  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswers((prev) => [...prev, { id: q.id, topic: q.topic, correct: i === q.answer }]);
  };
  const next = () => {
    if (index + 1 >= questions.length) {
      const correct = answers.filter((a) => a.correct).length;
      recordQuizScore(Math.round((correct / questions.length) * 100));
      setDone(true);
    } else { setIndex(index + 1); setSelected(null); }
  };

  return (
    <div className="container page">
      <div className="card quiz-card">
        <div className="quiz-progress">
          <span className="small muted">{t("quiz.q")} {index + 1} {t("quiz.of")} {questions.length} · {t(`quiz.${q.difficulty}`)}</span>
          <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / questions.length) * 100}%`, background: "var(--accent)" }} /></div>
        </div>
        <h2>{pick(q.question)}</h2>
        <div className="quiz-options">
          {pick(q.options).map((opt, i) => {
            const state = !answered ? "" : i === q.answer ? "right" : i === selected ? "wrong" : "dim";
            return <button key={opt} type="button" className={`quiz-opt ${state}`} onClick={() => choose(i)} disabled={answered} aria-pressed={selected === i}><span className="quiz-letter">{String.fromCharCode(65 + i)}</span>{opt}</button>;
          })}
        </div>
        {answered && (
          <div className={`notice fade-in ${selected === q.answer ? "" : "notice-warn"}`} role="status">
            <Icon name={selected === q.answer ? "check" : "x"} size={18} />
            <div><strong>{selected === q.answer ? t("quiz.correct") : t("quiz.wrong")}</strong> {pick(q.explanation)}</div>
          </div>
        )}
        <div className="quiz-nav">
          <button type="button" className="btn btn-secondary" onClick={restart}>{t("quiz.restart")}</button>
          <button type="button" className="btn btn-primary" onClick={next} disabled={!answered}>{index + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")} <Icon name="arrow" size={18} /></button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
