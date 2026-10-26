import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ScamSolutions.css";

function CaseStatusLookup({ initialCaseNumber = "", onDeleted }) {
  const [caseNumber, setCaseNumber] = useState(initialCaseNumber);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState(false);

  const checkStatus = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setStatus(null);

    const value = caseNumber.trim().toUpperCase();
    if (!/^CASE-[A-F0-9]{32}$/.test(value)) {
      setError("Enter a valid CyberRakshak case number.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/scam-report/case/${encodeURIComponent(value)}`);
      if (!response?.report) throw new Error("No CyberRakshak report status was returned.");
      setStatus(response.report);
    } catch (requestError) {
      setError(requestError.message || "Unable to check this case number right now.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async () => {
    if (!status?.caseNumber || deleting) return;
    const confirmed = window.confirm(
      "Delete this report from active CyberRakshak records? This cannot be undone. Backup copies, if any, may remain under the hosting provider's backup policy."
    );
    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeleting(true);
    try {
      await apiRequest("/scam-report/case/" + encodeURIComponent(status.caseNumber), {
        method: "DELETE",
      });
      setStatus(null);
      setCaseNumber("");
      if (onDeleted) {
        onDeleted();
      } else {
        setNotice("The report was deleted from active CyberRakshak records.");
      }
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete this report right now.");
    } finally {
      setDeleting(false);
    }
  };

  const submittedAt = status?.reportedAt ? new Date(status.reportedAt) : null;
  const formattedDate = submittedAt && !Number.isNaN(submittedAt.getTime())
    ? submittedAt.toLocaleString()
    : "Unavailable";

  return (
    <section className="case-lookup" aria-labelledby="case-lookup-title">
      <h2 id="case-lookup-title">Check a CyberRakshak report</h2>
      <p id="case-lookup-note">
        Enter the private case reference to see the status. Anyone with the reference can view the status
        or delete the active report, so keep it private. This is not an official police or government report.
      </p>
      <form className="case-lookup-form" onSubmit={checkStatus}>
        <div className="form-group">
          <label htmlFor="case-number-lookup">CyberRakshak case number</label>
          <input
            id="case-number-lookup"
            value={caseNumber}
            onChange={(event) => {
              setCaseNumber(event.target.value.toUpperCase());
              setStatus(null);
              setNotice("");
              setError("");
            }}
            placeholder="CASE-..."
            maxLength={45}
            autoComplete="off"
            disabled={loading || deleting}
            aria-describedby="case-lookup-note"
            required
          />
        </div>
        <button type="submit" className="link-btn" disabled={loading || deleting || !caseNumber.trim()}>
          {loading ? "Checking…" : "Check status"}
        </button>
      </form>
      {error && <p className="case-lookup-error" role="alert">{error}</p>}
      {notice && <p className="case-lookup-notice" role="status">{notice}</p>}
      {status && (
        <div className="case-lookup-status" role="status" aria-live="polite">
          <h3>CyberRakshak report status</h3>
          <p><strong>Case number:</strong> {status.caseNumber}</p>
          <p><strong>Status:</strong> {String(status.status || "unknown").replaceAll("-", " ")}</p>
          <p><strong>Submitted:</strong> {formattedDate}</p>
          <button
            type="button"
            className="link-btn case-lookup-delete"
            onClick={deleteReport}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete my report"}
          </button>
        </div>
      )}
    </section>
  );
}

function ScamSolutions() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ reporterName: "", reporterEmail: "", reporterPhone: "", scamType: "", scamDescription: "", suspectDetails: "", amountLost: "" });
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reportNotice, setReportNotice] = useState("");

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsLoading(true);
    try {
      const data = await apiRequest("/scam-report", {
        method: "POST",
        body: JSON.stringify({ ...formData, scamDescription: formData.scamDescription.trim(), suspectDetails: formData.suspectDetails.trim() }),
        timeoutMs: 15000,
      });
      setCaseNumber(data?.caseNumber || data?.report?.caseNumber || "Submitted successfully");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Unable to submit the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return <div className="scam-container"><div className="success-message"><div className="success-icon">✅</div><h1>Report Submitted Successfully!</h1><p>Your report has been registered by CyberRakshak.</p><div className="case-info"><p>Case Number:</p><p className="case-number">{caseNumber}</p><p className="case-note">Save this number for future reference.</p></div><CaseStatusLookup
        initialCaseNumber={caseNumber}
        onDeleted={() => {
          setSubmitted(false);
          setCaseNumber("");
          setFormData({ reporterName: "", reporterEmail: "", reporterPhone: "", scamType: "", scamDescription: "", suspectDetails: "", amountLost: "" });
          setReportNotice("Your report was deleted from active CyberRakshak records. Backup copies, if any, may remain under the hosting provider's backup policy.");
        }}
      /><div className="next-steps"><h3>Important Next Steps:</h3><ul><li>Keep relevant transaction details and evidence.</li><li>If money was lost, contact your bank/payment provider immediately.</li><li>For cyber financial fraud in India, report immediately through 1930 or the National Cyber Crime Reporting Portal.</li><li>CyberRakshak is an assistance/education platform, not a replacement for police, bank, or government reporting.</li></ul></div><div className="success-actions"><button className="action-btn primary" onClick={() => navigate("/")}>Go to Home</button><button className="action-btn secondary" onClick={() => navigate("/emergency-help")}>Emergency Help</button></div></div></div>;
  }

  return (
    <div className="scam-container">
      <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="scam-header"><h1>⚠️ Report a Scam</h1><p>Document suspected fraudulent activity and get guidance on next steps.</p></div>
      <div className="scam-content">
        {reportNotice && <p className="case-lookup-notice" role="status">{reportNotice}</p>}
        <div className="info-banner" role="note"><p><strong>Before you submit:</strong> CyberRakshak stores your name, email, optional phone, report description, suspect details, and amount lost so authorized administrators can manage the report.</p><p>Submitting here does not notify police, your bank, or a government agency. Use official channels for urgent reporting. Never include passwords, OTPs, PINs, CVVs, API keys, or other authentication secrets.</p></div>
        <form onSubmit={handleSubmit} className="scam-form">
          <section className="form-section"><h2>Your Information</h2><div className="form-group"><label htmlFor="reporterName">Full Name *</label><input type="text" id="reporterName" name="reporterName" value={formData.reporterName} onChange={handleChange} placeholder="Enter your full name" maxLength="100" required /></div><div className="form-row"><div className="form-group"><label htmlFor="reporterEmail">Email Address *</label><input type="email" id="reporterEmail" name="reporterEmail" value={formData.reporterEmail} onChange={handleChange} placeholder="your@email.com" maxLength="254" required /></div><div className="form-group"><label htmlFor="reporterPhone">Phone Number</label><input type="tel" id="reporterPhone" name="reporterPhone" value={formData.reporterPhone} onChange={handleChange} placeholder="10-digit phone number" maxLength="20" /></div></div></section>
          <section className="form-section"><h2>Scam Details</h2><div className="form-group"><label htmlFor="scamType">Type of Scam *</label><select id="scamType" name="scamType" value={formData.scamType} onChange={handleChange} required><option value="">Select a scam type...</option><option value="phishing">🎣 Phishing</option><option value="fake-job">💼 Fake Job Offer</option><option value="romance-scam">💔 Romance Scam</option><option value="investment-fraud">📈 Investment Fraud</option><option value="upi-fraud">💳 UPI Fraud</option><option value="sms-scam">📱 SMS Scam</option><option value="call-fraud">☎️ Call Fraud</option><option value="other">🔍 Other</option></select></div><div className="form-group"><label htmlFor="scamDescription">Scam Description *</label><textarea id="scamDescription" name="scamDescription" value={formData.scamDescription} onChange={handleChange} placeholder="Describe what happened, when, and how you were contacted." rows="5" minLength="20" maxLength="2000" required /><span className="char-count">{formData.scamDescription.length}/2000 characters</span></div><div className="form-group"><label htmlFor="suspectDetails">Suspect Details</label><textarea id="suspectDetails" name="suspectDetails" value={formData.suspectDetails} onChange={handleChange} placeholder="Website, phone number, social profile, organization name, or other non-secret details." rows="4" maxLength="2000" /></div><div className="form-group"><label htmlFor="amountLost">Amount Lost (in INR)</label><input type="number" id="amountLost" name="amountLost" value={formData.amountLost} onChange={handleChange} placeholder="0" min="0" max="100000000" step="0.01" /></div></section>
          <div className="form-disclaimer"><p><strong>Important:</strong> Provide only information you are comfortable sharing. Never include authentication secrets or payment PINs.</p></div>
          {submitError && <p role="alert" className="form-disclaimer">{submitError}</p>}
          <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Report"}</button>
        </form>
        <CaseStatusLookup />
        <section className="help-section"><h2>📚 Resources</h2><div className="resource-cards"><div className="resource-card"><h3>🛡️ How to Protect Yourself</h3><p>Learn prevention techniques in our Learning Center.</p><button className="link-btn" onClick={() => navigate("/learn")}>Learn More</button></div><div className="resource-card"><h3>🚨 Need Immediate Help?</h3><p>Get emergency and incident-response guidance.</p><button className="link-btn" onClick={() => navigate("/emergency-help")}>Emergency Contacts</button></div><div className="resource-card"><h3>🏛️ Official Cybercrime Reporting</h3><p>Use the Government of India's National Cyber Crime Reporting Portal.</p><button className="link-btn" onClick={() => window.open("https://cybercrime.gov.in", "_blank", "noopener,noreferrer")}>Open Official Portal</button></div></div></section>
      </div>
    </div>
  );
}

export default ScamSolutions;
