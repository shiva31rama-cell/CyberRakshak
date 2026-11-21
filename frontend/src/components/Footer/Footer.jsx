import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../Icon/Icon";
import "./Footer.css";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo"><Icon name="shield" size={18} /> CyberRakshak</div>
          <p>{t("footer.about")}</p>
        </div>
        <div>
          <h3>{t("footer.learn")}</h3>
          <Link to="/threats">{t("nav.threats")}</Link>
          <Link to="/videos">{t("nav.videos")}</Link>
          <Link to="/quiz">{t("nav.quiz")}</Link>
        </div>
        <div>
          <h3>{t("footer.tools")}</h3>
          <Link to="/analyser">{t("nav.analyser")}</Link>
          <Link to="/safety-guide">{t("nav.guide")}</Link>
          <Link to="/feedback">{t("footer.feedback")}</Link>
        </div>
        <div>
          <h3>{t("footer.help")}</h3>
          <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">{t("footer.report")} <Icon name="external" size={13} /></a>
          <a href="tel:1930">1930</a>
          <a href="https://www.cert-in.org.in/" target="_blank" rel="noopener noreferrer">CERT-In <Icon name="external" size={13} /></a>
        </div>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} CyberRakshak · {t("footer.disclaimer")}</p>
    </footer>
  );
}

export default Footer;
