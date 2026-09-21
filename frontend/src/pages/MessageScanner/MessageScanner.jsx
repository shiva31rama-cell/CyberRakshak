import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./MessageScanner.css";

const riskClass = (risk) => String(risk || "UNKNOWN").toLowerCase();

function MessageScanner() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!message.trim()) {
      setError("Paste the suspicious message first.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest("/scan/message", {
        method: "POST",
        body: JSON.stringify({ message: message.trim() }),
      });
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.message || "We could not analyze this message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page">
      <section className="scanner-hero">
        <div>
          <span className="eyebrow">SCAN · MESSAGE</span>
          <h1>Check a suspicious message before you act.</h1>
          <p>Paste an SMS, WhatsApp message, email, job offer or payment request. CyberRakshak checks observable warning signs and explains what to do next.</p>
        </div>
        <div className="scanner-shield" aria-hidden="true">🛡️</div>
      </section>

      <form className="scanner-card" onSubmit={analyze}>
        <label htmlFor="message">Suspicious message</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Example: Your bank account will be blocked today. Update KYC using this link..."
          maxLength={5000}
          rows={9}
        />
        <div className="scanner-form-footer">
          <span>{message.length}/5000</span>
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Message"}
          </button>
        </div>
        {error && <div className="scanner-error" role="alert">{error}</div>}
      </form>

      {result && (
        <section className="analysis-result" aria-live="polite">
          <div className="result-heading">
            <div>
              <span className="eyebrow">ANALYSIS</span>
              <h2>{result.category?.replaceAll("_", " ") || "Cyber safety review"}</h2>
            </div>
            <span className={`risk-badge ${riskClass(result.riskLevel)}`}>{result.riskLevel || "UNKNOWN"} RISK</span>
          </div>

          <div className="result-grid">
            <div className="result-panel">
              <h3>Why it may be suspicious</h3>
              <p>{result.explanation}</p>
              {result.indicators?.length > 0 && (
                <ul>{result.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}</ul>
              )}
            </div>
            <div className="result-panel action-panel">
              <h3>What you should do</h3>
              <ul>{result.recommendedActions?.map((action) => <li key={action}>✓ {action}</li>)}</ul>
            </div>
          </div>

          <div className="result-note">
            <strong>Important:</strong> this is an indicator-based analysis, not proof that the sender is fraudulent. Verify important requests through official channels.
          </div>

          <div className="result-actions">
            <button onClick={() => navigate("/emergency-help")}>Get Help</button>
            <button className="secondary" onClick={() => navigate("/learn")}>Learn Cyber Safety</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default MessageScanner;
