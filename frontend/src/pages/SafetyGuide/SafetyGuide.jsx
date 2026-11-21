import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../../components/Icon/Icon";

const OFFICIAL = [
  { key: "portal", href: "https://cybercrime.gov.in/", label: "cybercrime.gov.in", icon: "globe" },
  { key: "helpline", href: "tel:1930", label: "1930", icon: "phone", call: true },
  { key: "certin", href: "https://www.cert-in.org.in/", label: "cert-in.org.in", icon: "shield" },
];

function SafetyGuide() {
  const { t } = useLanguage();
  return (
    <div className="container page">
      <div className="page-head"><span className="eyebrow"><Icon name="shield" size={14} /> {t("nav.guide")}</span><h1>{t("guide.title")}</h1><p>{t("guide.desc")}</p></div>

      <h2>{t("guide.official")}</h2>
      <div className="grid grid-3" style={{ marginBottom: 12 }}>
        {OFFICIAL.map((o) => (
          <div className="card" key={o.key} style={{ borderTop: "4px solid var(--ok)" }}>
            <span className="badge badge-official"><Icon name="check" size={12} /> {t("vid.official")}</span>
            <h3 style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}><Icon name={o.icon} size={20} /> {t(`guide.${o.key}`)}</h3>
            <p className="muted small">{t(`guide.${o.key}D`)}</p>
            <a className={`btn ${o.call ? "btn-primary" : "btn-secondary"}`} href={o.href} {...(o.call ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              {o.call ? t("guide.call") : <>{t("guide.visit")} <Icon name="external" size={15} /></>}
            </a>
            <p className="small muted" style={{ margin: "10px 0 0" }}>{o.label}</p>
          </div>
        ))}
      </div>
      <p className="small muted">{t("guide.disclaimer")}</p>

      <div className="grid grid-2 section">
        <section className="card"><h2>{t("guide.steps")}</h2><ol className="list">{t("guide.stepsList").map((s) => <li key={s}>{s}</li>)}</ol></section>
        <section className="card"><h2>{t("guide.evidence")}</h2><ul className="check-list">{t("guide.evidenceList").map((s) => <li key={s}><Icon name="check" size={16} />{s}</li>)}</ul></section>
        <section className="card" style={{ borderLeft: "4px solid var(--high)" }}><h2>{t("guide.fast")}</h2><p>{t("guide.fastD")}</p><a className="btn btn-primary" href="tel:1930"><Icon name="phone" size={16} /> {t("guide.call")}</a></section>
        <section className="card"><h2>{t("guide.never")}</h2><ul className="check-list x-list">{t("guide.neverList").map((s) => <li key={s}><Icon name="x" size={16} />{s}</li>)}</ul></section>
      </div>
    </div>
  );
}

export default SafetyGuide;
