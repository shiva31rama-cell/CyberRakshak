import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t("footerAbout")}</h3>
            <p>{t("footerAboutText")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("quickLinks")}</h3>
            <ul>
              <li><Link to="/">{t("home")}</Link></li>
              <li><Link to="/check">{t("check")}</Link></li>
              <li><Link to="/learn">{t("learn")}</Link></li>
              <li><Link to="/emergency-help">{t("emergency")}</Link></li>
              <li><Link to="/report-scam">{t("report")}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("footerEmergency")}</h3>
            <ul>
              <li><a href="tel:1930">🛡️ 1930 — {t("cyberHelpline")}</a></li>
              <li><a href="tel:112">🚨 112 — {t("policeEmergency")}</a></li>
              <li><a href="tel:102">🏥 102 — {t("ambulance")}</a></li>
              <li><a href="tel:101">🚒 101 — {t("fire")}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("connect")}</h3>
            <ul className="footer-official-links">
              <li><a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">🇮🇳 National Cyber Crime Portal</a></li>
              <li><a href="https://www.cert-in.org.in/" target="_blank" rel="noopener noreferrer">🛡️ CERT-In</a></li>
              <li><a href="https://www.sancharsaathi.gov.in/" target="_blank" rel="noopener noreferrer">📱 Sanchar Saathi</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p>&copy; {currentYear} CyberRakshak. All rights reserved.</p>
            <div className="footer-legal"><Link to="/privacy">{t("privacy")}</Link><span>•</span><Link to="/terms">{t("terms")}</Link></div>
          </div>
          <div className="footer-badges">
            <span className="badge">🔒 {t("secure")}</span>
            <span className="badge">✅ {t("verified")}</span>
            <span className="badge">🌐 {t("multiLanguage")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
