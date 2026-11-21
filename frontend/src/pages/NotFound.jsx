import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="container page">
      <div className="empty">
        <h1>{t("notfound.title")}</h1>
        <Link className="btn btn-primary" to="/">{t("notfound.home")}</Link>
      </div>
    </div>
  );
}

export default NotFound;
