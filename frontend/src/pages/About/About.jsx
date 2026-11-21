import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../../components/Icon/Icon";

function About() {
  const { t } = useLanguage();
  return (
    <div className="container page">
      <div className="page-head"><span className="eyebrow"><Icon name="info" size={14} /> {t("nav.about")}</span><h1>{t("about.title")}</h1><p>{t("about.desc")}</p></div>
      <div className="grid grid-2">
        <section className="card"><h2>{t("about.mission")}</h2><ul className="check-list">{t("about.points").map((p) => <li key={p}><Icon name="check" size={16} />{p}</li>)}</ul></section>
        <section className="card"><h2>{t("an.limits.title")}</h2><ul className="list">{t("an.limits").map((p) => <li key={p}>{p}</li>)}</ul><p className="small muted">{t("guide.disclaimer")}</p><Link className="btn btn-secondary" to="/feedback">{t("about.feedback")}</Link></section>
      </div>
    </div>
  );
}

export default About;
