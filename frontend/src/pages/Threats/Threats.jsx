import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { THREATS, getThreat } from "../../../../shared/content/threats.mjs";
import { markTopicRead } from "../../services/progress";
import Icon from "../../components/Icon/Icon";
import "./Threats.css";

const CATS = ["all", "fraud", "social", "malware", "technical", "privacy"];

export function ThreatCard({ threat }) {
  const { t, pick } = useLanguage();
  return (
    <Link to={`/threats/${threat.slug}`} className="card link-card">
      <div className="threat-top"><span className="icon-tile"><Icon name={threat.icon} /></span><span className={`badge sev-${threat.severity}`}>{t(`sev.${threat.severity}`)}</span></div>
      <h3>{pick(threat.title)}</h3>
      <p>{pick(threat.summary)}</p>
      <span className="link-more">{t("threats.read")} <Icon name="arrow" size={16} /></span>
    </Link>
  );
}

export function Threats() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return THREATS.filter((x) => (cat === "all" || x.category === cat) && (!q || [x.title.en, x.title.te, x.summary.en, x.summary.te].some((s) => s.toLowerCase().includes(q))));
  }, [query, cat]);

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow"><Icon name="book" size={14} /> {t("nav.threats")}</span>
        <h1>{t("threats.title")}</h1>
        <p>{t("threats.desc")}</p>
      </div>
      <div className="toolbar">
        <div className="search"><Icon name="search" size={18} /><input className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("threats.search")} aria-label={t("threats.search")} /></div>
        <div className="chips">{CATS.map((c) => <button key={c} type="button" className={`chip ${cat === c ? "on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c === "all" ? t("threats.all") : t(`cat.${c}`)}</button>)}</div>
      </div>
      {list.length === 0 ? <div className="empty">{t("threats.empty")}</div> : <div className="grid grid-3">{list.map((x) => <ThreatCard key={x.slug} threat={x} />)}</div>}
    </div>
  );
}

const Section = ({ icon, title, children, tone }) => (
  <section className={`card td-section ${tone || ""}`}>
    <h2><Icon name={icon} size={20} /> {title}</h2>
    {children}
  </section>
);

export function ThreatDetail() {
  const { slug } = useParams();
  const { t, pick } = useLanguage();
  const threat = getThreat(slug);

  useEffect(() => { if (threat) markTopicRead(threat.slug); }, [threat]);

  if (!threat) {
    return <div className="container page"><div className="empty">{t("t.notfound")} <Link to="/threats">{t("t.back")}</Link></div></div>;
  }
  const list = (items, cls = "check-list", icon = "check") => <ul className={cls}>{pick(items).map((s) => <li key={s}><Icon name={icon} size={16} />{s}</li>)}</ul>;

  return (
    <div className="container page td">
      <Link to="/threats" className="btn btn-ghost"><span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><Icon name="arrow" size={16} /></span> {t("t.back")}</Link>
      <div className="td-head">
        <span className="icon-tile"><Icon name={threat.icon} size={24} /></span>
        <div>
          <span className={`badge sev-${threat.severity}`}>{t(`sev.${threat.severity}`)}</span> <span className="badge">{t(`cat.${threat.category}`)}</span>
          <h1>{pick(threat.title)}</h1>
          <p className="muted">{pick(threat.summary)}</p>
        </div>
      </div>
      <div className="grid grid-2">
        <Section icon="info" title={t("t.what")}><p>{pick(threat.what)}</p></Section>
        <Section icon="globe" title={t("t.how")}><p>{pick(threat.how)}</p></Section>
        <Section icon="users" title={t("t.targeting")}><p>{pick(threat.targeting)}</p></Section>
        <Section icon="message" title={t("t.scenario")} tone="td-scenario"><p>{pick(threat.scenario)}</p><p className="small muted">{t("t.scenarioNote")}</p></Section>
        <Section icon="alert" title={t("t.warning")}>{list(threat.warningSigns, "check-list x-list", "alert")}</Section>
        <Section icon="search" title={t("t.identify")}>{list(threat.identify)}</Section>
        <Section icon="shield" title={t("t.prevention")}>{list(threat.prevention)}</Section>
        <Section icon="phone" title={t("t.victim")} tone="td-victim">{list(threat.victim, "check-list", "arrow")}<Link to="/safety-guide" className="link-more">{t("nav.guide")} <Icon name="arrow" size={16} /></Link></Section>
      </div>
    </div>
  );
}
