import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Learn2.css";
import { useLanguage } from "../../i18n/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ui = {
  en: {
    eyebrow: "LEARN 2.0 · CYBER SAFETY",
    title: "Learn the scam before it reaches you.",
    lead: "Short, scenario-based lessons built around real safety decisions: spot the signal, slow down, verify independently, and know what to do next.",
    check: "Check something →",
    radar: "See Threat Radar",
    categories: { all: "All lessons", payments: "Payments", mobile: "Mobile", "ai-scams": "AI scams", messages: "Messages" },
    loading: "Loading safety lessons…",
    error: "Learning content could not be loaded. Please try again later.",
    open: "Open lesson →",
    min: "min",
    scenario: "SCENARIO LESSON",
    signals: "Signals to notice",
    safer: "SAFER MOVE",
    quick: "Quick check",
    correct: "Correct. Independent verification is the safer habit.",
    wrong: "Not the safest choice. Slow down and verify independently.",
    useCheck: "Use Check Center →",
    close: "Close lesson",
  },
  te: {
    eyebrow: "లెర్న్ 2.0 · సైబర్ భద్రత",
    title: "స్కామ్ మీ వరకు రాకముందే దాన్ని తెలుసుకోండి.",
    lead: "నిజ జీవిత భద్రతా నిర్ణయాలపై చిన్న పరిస్థితి ఆధారిత పాఠాలు: సంకేతాన్ని గుర్తించండి, నెమ్మదించండి, స్వతంత్రంగా ధృవీకరించండి, తర్వాత ఏమి చేయాలో తెలుసుకోండి.",
    check: "ఏదైనా చెక్ చేయండి →",
    radar: "థ్రెట్ రాడార్ చూడండి",
    categories: { all: "అన్ని పాఠాలు", payments: "చెల్లింపులు", mobile: "మొబైల్", "ai-scams": "AI స్కామ్‌లు", messages: "మెసేజ్‌లు" },
    loading: "భద్రతా పాఠాలు లోడ్ అవుతున్నాయి…",
    error: "లెర్నింగ్ కంటెంట్ లోడ్ కాలేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
    open: "పాఠం తెరవండి →",
    min: "నిమి",
    scenario: "పరిస్థితి ఆధారిత పాఠం",
    signals: "గమనించాల్సిన సంకేతాలు",
    safer: "సురక్షితమైన చర్య",
    quick: "త్వరిత చెక్",
    correct: "సరైన సమాధానం. స్వతంత్ర ధృవీకరణ మంచి భద్రతా అలవాటు.",
    wrong: "ఇది సురక్షితమైన ఎంపిక కాదు. నెమ్మదించి స్వతంత్రంగా ధృవీకరించండి.",
    useCheck: "చెక్ సెంటర్ ఉపయోగించండి →",
    close: "పాఠం మూసివేయండి",
  },
};

function Learn2() {
  const { language } = useLanguage();
  const text = ui[language];
  const [modules, setModules] = useState([]);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/learn?language=${language}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Learning service unavailable");
        const data = await response.json();
        setModules(data.modules || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [language]);

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
          <span className="eyebrow">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
        </div>
        <div className="learn2-hero-actions">
          <Link to="/check" className="primary-action">{text.check}</Link>
          <Link to="/threats" className="secondary-action">{text.radar}</Link>
        </div>
      </header>

      <section className="learn2-toolbar" aria-label={language === "te" ? "లెర్నింగ్ కేటగిరీలు" : "Learning categories"}>
        {categories.map((item) => (
          <button key={item} className={category === item ? "category-chip active" : "category-chip"} onClick={() => setCategory(item)} type="button">
            {text.categories[item] || item.replace("-", " ")}
          </button>
        ))}
      </section>

      {loading && <div className="learn2-state">{text.loading}</div>}
      {error && <div className="learn2-state error">{text.error}</div>}

      {!loading && !error && (
        <main className="learn2-grid">
          {visibleModules.map((module, index) => (
            <article className="learn2-card" key={module.id}>
              <div className="learn2-card-top">
                <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
                <span className={`severity ${module.severity}`}>{module.severity}</span>
              </div>
              <h2>{module.title}</h2>
              <p className="scenario">{module.scenario}</p>
              <div className="lesson-meta">{module.durationMinutes} {text.min} · {text.categories[module.category] || module.category.replace("-", " ")}</div>
              <button type="button" className="learn2-open" onClick={() => openModule(module)}>{text.open}</button>
            </article>
          ))}
        </main>
      )}

      {selected && (
        <div className="lesson-overlay" role="dialog" aria-modal="true" aria-labelledby="lesson-title" onClick={() => setSelected(null)}>
          <article className="lesson-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-lesson" onClick={() => setSelected(null)} aria-label={text.close}>×</button>
            <span className="eyebrow">{text.scenario}</span>
            <h2 id="lesson-title">{selected.title}</h2>
            <p className="lesson-scenario">{selected.scenario}</p>

            <section className="lesson-section">
              <h3>{text.signals}</h3>
              <ul>{selected.redFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul>
            </section>

            <section className="safe-action">
              <span>{text.safer}</span>
              <p>{selected.safeAction}</p>
            </section>

            <section className="lesson-quiz">
              <h3>{text.quick}</h3>
              <p>{selected.checkQuestion}</p>
              <div className="answer-list">
                {selected.answers.map((item) => (
                  <button key={item.id} type="button" className={answer === item.id ? (item.correct ? "answer correct" : "answer wrong") : "answer"} onClick={() => setAnswer(item.id)}>{item.text}</button>
                ))}
              </div>
              {answer && <p className={selected.answers.find((item) => item.id === answer)?.correct ? "quiz-result correct-text" : "quiz-result"}>{selected.answers.find((item) => item.id === answer)?.correct ? text.correct : text.wrong}</p>}
            </section>

            <Link to="/check" className="primary-action lesson-check">{text.useCheck}</Link>
          </article>
        </div>
      )}
    </div>
  );
}

export default Learn2;
