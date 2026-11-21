import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { THREATS } from "../../../../shared/content/threats.mjs";
import { VIDEOS } from "../../../../shared/content/videos.mjs";
import { getProgress } from "../../services/progress";
import { ThreatCard } from "../Threats/Threats";
import { VideoCard } from "../Videos/Videos";
import Icon from "../../components/Icon/Icon";
import "./Home.css";

const FEATURED = ["phishing", "upi-fraud", "otp-scams", "fake-job-scams", "investment-scams", "social-engineering"];
const RECENT_VIDEOS = ["dx5A2-j19nI", "Q1p4WW359bM", "tfYBMwKq-1E"];

function Home() {
  const { t } = useLanguage();
  const progress = getProgress();
  const featured = FEATURED.map((s) => THREATS.find((x) => x.slug === s)).filter(Boolean);
  const videos = RECENT_VIDEOS.map((id) => VIDEOS.find((v) => v.id === id)).filter(Boolean);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><Icon name="shield" size={14} /> CyberRakshak</span>
            <h1>{t("home.title")}</h1>
            <p>{t("home.desc")}</p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" to="/threats"><Icon name="book" size={18} />{t("home.cta.threats")}</Link>
              <Link className="btn btn-secondary" to="/analyser"><Icon name="message" size={18} />{t("home.cta.analyse")}</Link>
              <Link className="btn btn-secondary" to="/quiz"><Icon name="quiz" size={18} />{t("home.cta.quiz")}</Link>
            </div>
          </div>
          <div className="hero-panel card" aria-hidden="true">
            <div className="hp-row"><span className="hp-dot crit" /><span>“Your KYC expires today. Share OTP…”</span><span className="badge sev-critical">{t("lvl.critical")}</span></div>
            <div className="hp-row"><span className="hp-dot warn" /><span>“Flat 40% off – shop now”</span><span className="badge sev-medium">{t("cls.potential_spam")}</span></div>
            <div className="hp-row"><span className="hp-dot ok" /><span>“Reached home, will call later”</span><span className="badge badge-official">{t("cls.likely_safe")}</span></div>
            <p className="small muted" style={{ margin: "8px 0 0" }}>{t("t.scenarioNote")}</p>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="section-head"><h2>{t("home.why.title")}</h2></div>
          <div className="grid grid-3">
            {[1, 2, 3].map((n) => <div className="card" key={n}><span className="icon-tile"><Icon name={["users", "wallet", "shield"][n - 1]} /></span><h3>{t(`home.why.${n}t`)}</h3><p className="muted" style={{ margin: 0 }}>{t(`home.why.${n}d`)}</p></div>)}
          </div>
        </section>

        <section className="section grid grid-2">
          <div className="card">
            <h2>{t("home.tips.title")}</h2>
            <ul className="check-list">{t("home.tips").map((tip) => <li key={tip}><Icon name="check" size={16} />{tip}</li>)}</ul>
          </div>
          <div className="card quick-analyse">
            <span className="icon-tile"><Icon name="message" /></span>
            <h2>{t("home.quick.title")}</h2>
            <p className="muted">{t("home.quick.desc")}</p>
            <Link className="btn btn-primary" to="/analyser">{t("home.cta.analyse")} <Icon name="arrow" size={18} /></Link>
            <div className="progress-box">
              <h3>{t("home.progress")}</h3>
              <div className="progress-stats">
                <div><strong>{progress.topics.length}/{THREATS.length}</strong><span>{t("home.progress.topics")}</span></div>
                <div><strong>{progress.bestScore === null ? "—" : `${progress.bestScore}%`}</strong><span>{progress.bestScore === null ? t("home.progress.none") : t("home.progress.quiz")}</span></div>
              </div>
              <p className="small muted" style={{ margin: 0 }}>{t("home.progress.note")}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head"><h2>{t("home.featured")}</h2><Link className="link-more" to="/threats">{t("home.viewall")} <Icon name="arrow" size={16} /></Link></div>
          <div className="grid grid-3">{featured.map((x) => <ThreatCard key={x.slug} threat={x} />)}</div>
        </section>

        <section className="section">
          <div className="section-head"><h2>{t("home.videos")}</h2><Link className="link-more" to="/videos">{t("home.allvideos")} <Icon name="arrow" size={16} /></Link></div>
          <div className="grid grid-3">{videos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
        </section>
      </div>
    </>
  );
}

export default Home;
