import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { analyse } from "../../services/analyzerService";
import { MAX_MESSAGE_LENGTH } from "../../../../shared/analyzer/messageAnalyzer.mjs";
import Icon from "../../components/Icon/Icon";
import "./Analyzer.css";

const SAMPLES = {
  lottery: "Congratulations! You won ₹25,00,000. Click this link immediately and enter your bank details to claim your prize: bit.ly/claim-prize-now",
  otp: "Dear Customer, your SBI account will be blocked today. Share the OTP sent to your mobile with our executive to verify your KYC. Call 9876543210.",
  bank: "Rs.1,250.00 debited from A/c XX1234 on 20-11-26 to VPA grocer@okaxis. Not you? Call the number on the back of your card. Never share your OTP or PIN with anyone. -Bank",
  job: "Part time job! Earn Rs 3000 per day by liking YouTube videos. No experience required. Pay Rs 500 registration fee. WhatsApp us on Telegram task group.",
  personal: "Hi Amma, I reached the hostel safely. Will call you after dinner tonight.",
};

const LEVEL_CLASS = { low: "lvl-low", medium: "lvl-medium", high: "lvl-high", critical: "lvl-critical" };

function Analyzer() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) { setError(t("an.err.empty")); setResult(null); return; }
    if (text.length > MAX_MESSAGE_LENGTH) { setError(t("an.err.too_long")); setResult(null); return; }
    setLoading(true);
    try {
      setResult(await analyse(text));
    } catch (err) {
      setResult(null);
      setError(err.code === "rate" ? t("an.err.rate") : err.code === "too_long" ? t("an.err.too_long") : err.code === "empty" ? t("an.err.empty") : t("an.err.generic"));
    } finally {
      setLoading(false);
    }
  };

  const ind = (id) => t(`ind.${id}`);
  const urlLabel = (risk) => t(`an.link.${risk}`);

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow"><Icon name="message" size={14} /> {t("nav.analyser")}</span>
        <h1>{t("an.title")}</h1>
        <p>{t("an.desc")}</p>
      </div>

      <div className="an-layout">
        <form className="card an-form" onSubmit={submit} noValidate>
          <label htmlFor="msg" className="sr-only">{t("an.title")}</label>
          <textarea id="msg" className="textarea an-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("an.placeholder")} rows={9} maxLength={MAX_MESSAGE_LENGTH + 500} spellCheck="false" aria-describedby="msg-count" />
          <div className="an-meta">
            <span id="msg-count" className={`small ${text.length > MAX_MESSAGE_LENGTH ? "over" : "muted"}`}>{text.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()}</span>
          </div>
          <div className="an-samples">
            <span className="small muted">{t("an.samples")}</span>
            {Object.keys(SAMPLES).map((k) => (
              <button type="button" key={k} className="chip" onClick={() => { setText(SAMPLES[k]); setResult(null); setError(""); }}>{t(`an.sample.${k}`)}</button>
            ))}
          </div>
          {error && <div className="notice notice-warn" role="alert"><Icon name="alert" size={18} />{error}</div>}
          <div className="an-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><span className="spinner" />{t("an.loading")}</> : <><Icon name="search" size={18} />{t("an.button")}</>}</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setText(""); setResult(null); setError(""); }}>{t("an.clear")}</button>
          </div>
        </form>

        <aside className="an-side">
          <div className="card">
            <h3><Icon name="info" size={18} /> {t("an.limits.title")}</h3>
            <ul className="list small">{t("an.limits").map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
          <div className="card">
            <h3><Icon name="lock" size={18} /> {t("an.privacy.title")}</h3>
            <p className="small muted" style={{ margin: 0 }}>{t("an.privacy")}</p>
          </div>
        </aside>
      </div>

      {result && (
        <section className="card an-result fade-in" aria-live="polite">
          <h2>{t("an.result")}</h2>
          <div className="an-summary">
            <div><span className="small muted">{t("an.classification")}</span><strong className={`an-cls ${LEVEL_CLASS[result.level]}`}>{t(`cls.${result.classification}`)}</strong></div>
            <div><span className="small muted">{t("an.level")}</span><strong className={`an-lvl ${LEVEL_CLASS[result.level]}`}>{t(`lvl.${result.level}`)}</strong></div>
            <div className="an-score">
              <span className="small muted">{t("an.score")}</span>
              <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.score}><span className={LEVEL_CLASS[result.level]} style={{ width: `${Math.max(3, result.score)}%` }} /></div>
              <span className="small">{result.score} / 100</span>
            </div>
          </div>
          <p className="small muted">{t("an.scoreNote")}</p>
          {result.protectiveLanguage && <div className="notice"><Icon name="check" size={18} />{t("an.protective")}</div>}

          <div className="grid grid-2 an-details">
            <div>
              <h3>{t("an.indicators")}</h3>
              {result.indicators.length === 0 ? <p className="muted">{t("an.noIndicators")}</p> : (
                <ul className="an-ind">
                  {result.indicators.map((i) => (
                    <li key={i.id}>
                      <Icon name="alert" size={16} />
                      <div>
                        <strong>{ind(i.id)[0]}</strong>
                        <p>{ind(i.id)[1]}</p>
                        {i.id !== "writing_style" && i.phrases.length > 0 && (
                          <p className="an-phrases"><span>{t("an.phrases")}:</span> {i.phrases.map((p) => <mark key={p}>{p}</mark>)}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>{t("an.recommend")}</h3>
              <ul className="check-list">{t(`rec.${result.classification}`).map((r) => <li key={r}><Icon name="check" size={16} />{r}</li>)}</ul>
              {result.urls.length > 0 && (
                <>
                  <h3 style={{ marginTop: 20 }}>{t("an.links")}</h3>
                  <ul className="an-urls">
                    {result.urls.map((u) => (
                      <li key={u.url}>
                        <code>{u.url}</code>
                        <span className={`badge url-${u.risk}`}>{urlLabel(u.risk)}</span>
                        {u.reasons.length > 0 && <span className="small muted">{u.reasons.map((r) => t(`url.${r}`)).join(" · ")}</span>}
                      </li>
                    ))}
                  </ul>
                  <p className="small muted">{t("an.linkNote")}</p>
                </>
              )}
            </div>
          </div>
          <p className="small muted an-engine"><Icon name="shield" size={14} /> {result.source === "server" ? t("an.engine.server") : t("an.engine.local")}</p>
        </section>
      )}
    </div>
  );
}

export default Analyzer;
