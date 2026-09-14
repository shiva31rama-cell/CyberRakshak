import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ScamSolutions.css";

function ScamSolutions() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ reporterName: "", reporterEmail: "", reporterPhone: "", scamType: "", scamDescription: "", suspectDetails: "", amountLost: "" });
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    return <div className="scam-container"><div className="success-message"><div className="success-icon">✅</div><h1>Report Submitted Successfully!</h1><p>Your report has been registered by CyberRakshak.</p><div className="case-info"><p>Case Number:</p><p className="case-number">{caseNumber}</p><p className="case-note">Save this number for future reference.</p></div><div className="next-steps"><h3>Important Next Steps:</h3><ul><li>Keep relevant transaction details and evidence.</li><li>If money was lost, contact your bank/payment provider immediately.</li><li>For cyber financial fraud in India, report immediately through 1930 or the National Cyber Crime Reporting Portal.</li><li>CyberRakshak is an assistance/education platform, not a replacement for police, bank, or government reporting.</li></ul></div><div className="success-actions"><button className="action-btn primary" onClick={() => navigate("/")}>Go to Home</button><button className="action-btn secondary" onClick={() => navigate("/emergency-help")}>Emergency Help</button></div></div></div>;
  }

  return (
    <div className="scam-container">
      <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="scam-header"><h1>⚠️ Report a Scam</h1><p>Document suspected fraudulent activity and get guidance on next steps.</p></div>
      <div className="scam-content">
        <div className="info-banner"><p><strong>Safety:</strong> Do not enter passwords, OTPs, UPI PINs, card PINs, API keys, or other secrets in this form.</p></div>
        <form onSubmit={handleSubmit} className="scam-form">
          <section className="form-section"><h2>Your Information</h2><div className="form-group"><label htmlFor="reporterName">Full Name *</label><input type="text" id="reporterName" name="reporterName" value={formData.reporterName} onChange={handleChange} placeholder="Enter your full name" maxLength="100" required /></div><div className="form-row"><div className="form-group"><label htmlFor="reporterEmail">Email Address *</label><input type="email" id="reporterEmail" name="reporterEmail" value={formData.reporterEmail} onChange={handleChange} placeholder="your@email.com" maxLength="254" required /></div><div className="form-group"><label htmlFor="reporterPhone">Phone Number</label><input type="tel" id="reporterPhone" name="reporterPhone" value={formData.reporterPhone} onChange={handleChange} placeholder="10-digit phone number" maxLength="20" /></div></div></section>
          <section className="form-section"><h2>Scam Details</h2><div className="form-group"><label htmlFor="scamType">Type of Scam *</label><select id="scamType" name="scamType" value={formData.scamType} onChange={handleChange} required><option value="">Select a scam type...</option><option value="phishing">🎣 Phishing</option><option value="fake-job">💼 Fake Job Offer</option><option value="romance-scam">💔 Romance Scam</option><option value="investment-fraud">📈 Investment Fraud</option><option value="upi-fraud">💳 UPI Fraud</option><option value="sms-scam">📱 SMS Scam</option><option value="call-fraud">☎️ Call Fraud</option><option value="other">🔍 Other</option></select></div><div className="form-group"><label htmlFor="scamDescription">Scam Description *</label><textarea id="scamDescription" name="scamDescription" value={formData.scamDescription} onChange={handleChange} placeholder="Describe what happened, when, and how you were contacted." rows="5" minLength="20" maxLength="2000" required /><span className="char-count">{formData.scamDescription.length}/2000 characters</span></div><div className="form-group"><label htmlFor="suspectDetails">Suspect Details</label><textarea id="suspectDetails" name="suspectDetails" value={formData.suspectDetails} onChange={handleChange} placeholder="Website, phone number, social profile, organization name, or other non-secret details." rows="4" maxLength="2000" /></div><div className="form-group"><label htmlFor="amountLost">Amount Lost (in INR)</label><input type="number" id="amountLost" name="amountLost" value={formData.amountLost} onChange={handleChange} placeholder="0" min="0" max="100000000" step="0.01" /></div></section>
          <div className="form-disclaimer"><p><strong>Important:</strong> Provide only information you are comfortable sharing. Never include authentication secrets or payment PINs.</p></div>
          {submitError && <p role="alert" className="form-disclaimer">{submitError}</p>}
          <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Report"}</button>
        </form>
        <section className="help-section"><h2>📚 Resources</h2><div className="resource-cards"><div className="resource-card"><h3>🛡️ How to Protect Yourself</h3><p>Learn prevention techniques in our Learning Center.</p><button className="link-btn" onClick={() => navigate("/learn")}>Learn More</button></div><div className="resource-card"><h3>🚨 Need Immediate Help?</h3><p>Get emergency and incident-response guidance.</p><button className="link-btn" onClick={() => navigate("/emergency-help")}>Emergency Contacts</button></div><div className="resource-card"><h3>🏛️ Official Cybercrime Reporting</h3><p>Use the Government of India's National Cyber Crime Reporting Portal.</p><button className="link-btn" onClick={() => window.open("https://cybercrime.gov.in", "_blank", "noopener,noreferrer")}>Open Official Portal</button></div></div></section>
      </div>
    </div>
  );
}

export default ScamSolutions;
