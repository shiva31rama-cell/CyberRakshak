import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Learn2.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Learn2() {
  const [modules, setModules] = useState([]);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/learn`);
        if (!response.ok) throw new Error("Learning service unavailable");
        const data = await response.json();
        setModules(data.modules || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => ["all", ...new Set(modules.map((item) => item.category))], [modules]);
  const visibleModules = category === "all" ? modules : modules.filter((item) => item.category === category);

  const openModule = (module) => {
    setSelected(module);
    setAnswer(null);
  };

  return (
    <div className="learn2-page">
      <header className="learn2-hero">
        <div>
          <span className="eyebrow">LEARN 2.0 · CYBER SAFETY</span>
          <h1>Learn the scam before it reaches you.</h1>
          <p>Short, scenario-based lessons built around real safety decisions: spot the signal, slow down, verify independently, and know what to do next.</p>
        </div>
        <div className="learn2-hero-actions">
          <Link to="/check" className="primary-action">Check something →</Link>
          <Link to="/threats" className="secondary-action">See Threat Radar</Link>
        </div>
      </header>

      <section className="learn2-toolbar" aria-label="Learning categories">
        {categories.map((item) => (
          <button key={item} className={category === item ? "category-chip active" : "category-chip"} onClick={() => setCategory(item)} type="button">
            {item === "all" ? "All lessons" : item.replace("-", " ")}
          </button>
        ))}
      </section>

      {loading && <div className="learn2-state">Loading safety lessons…</div>}
      {error && <div className="learn2-state error">Learning content could not be loaded. Please try again later.</div>}

      {!loading && !error && (
        <main className="learn2-grid">
          {visibleModules.map((module, index) => (
            <article className="learn2-card" key={module.id}>
              <div className="learn2-card-top">
                <span className="lesson-number">0{index + 1}</span>
                <span className={`severity ${module.severity}`}>{module.severity}</span>
              </div>
              <h2>{module.title}</h2>
              <p className="scenario">{module.scenario}</p>
              <div className="lesson-meta">{module.durationMinutes} min · {module.category.replace("-", " ")}</div>
              <button type="button" className="learn2-open" onClick={() => openModule(module)}>Open lesson →</button>
            </article>
          ))}
        </main>
      )}

      {selected && (
        <div className="lesson-overlay" role="dialog" aria-modal="true" aria-labelledby="lesson-title" onClick={() => setSelected(null)}>
          <article className="lesson-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-lesson" onClick={() => setSelected(null)} aria-label="Close lesson">×</button>
            <span className="eyebrow">SCENARIO LESSON</span>
            <h2 id="lesson-title">{selected.title}</h2>
            <p className="lesson-scenario">{selected.scenario}</p>

            <section className="lesson-section">
              <h3>Signals to notice</h3>
              <ul>{selected.redFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul>
            </section>

            <section className="safe-action">
              <span>SAFER MOVE</span>
              <p>{selected.safeAction}</p>
            </section>

            <section className="lesson-quiz">
              <h3>Quick check</h3>
              <p>{selected.checkQuestion}</p>
              <div className="answer-list">
                {selected.answers.map((item) => (
                  <button key={item.id} type="button" className={answer === item.id ? (item.correct ? "answer correct" : "answer wrong") : "answer"} onClick={() => setAnswer(item.id)}>{item.text}</button>
                ))}
              </div>
              {answer && <p className={selected.answers.find((item) => item.id === answer)?.correct ? "quiz-result correct-text" : "quiz-result"}>{selected.answers.find((item) => item.id === answer)?.correct ? "Correct. Independent verification is the safer habit." : "Not the safest choice. Slow down and verify independently."}</p>}
            </section>

            <Link to="/check" className="primary-action lesson-check">Use Check Center →</Link>
          </article>
        </div>
      )}
    </div>
  );
}

export default Learn2;
