import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitScamReport } from "../../services/scamService";
import "./ScamSolutions.css";

const initialForm = { reporterName: "", reporterEmail: "", reporterPhone: "", scamType: "", scamDescription: "", suspectDetails: "", amountLost: "" };

function ScamSolutions() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.scamDescription.trim().length < 20) return setError("Please provide at least 20 characters describing the scam.");
    setIsLoading(true); setError("");
    try {
      const result = await submitScamReport({ ...formData, reporterName: formData.reporterName.trim(), reporterEmail: formData.reporterEmail.trim(), scamType: formData.scamType.trim(), scamDescription: formData.scamDescription.trim(), suspectDetails: formData.suspectDetails.trim() });
      setCaseNumber(result.caseNumber); setSubmitted(true); setFormData(initialForm);
    } catch (submitError) { setError(submitError.message || "Unable to submit the report. Please try again."); }
    finally { setIsLoading(false); }
  };

  if (submitted) return <div className="scam-container"><div className="success-message"><div className="success-icon">✅</div><h1>Report Submitted Successfully!</h1><p>Your report has been registered securely.</p><div className="case-info"><p>Your Case Number:</p><p className="case-number">{caseNumber}</p><p className="case-note">Save this number to track your case status.</p></div><div className="next-steps"><h3>Next Steps:</h3><ul><li>✓ Keep your case number safe</li><li>✓ Our team can review the submitted report</li><li>✓ Use emergency resources if immediate assistance is required</li></ul></div><div className="success-actions"><button className="action-btn primary" onClick={() => navigate("/")}>Go to Home</button><button className="action-btn secondary" onClick={() => navigate("/emergency-help")}>Emergency Help</button></div></div></div>;

  return <div className="scam-container"><button className="back-button" onClick={() => navigate("/")}>← Back to Home</button><div className="scam-header"><h1>⚠️ Report a Scam</h1><p>Help us fight cybercrime by reporting fraudulent activities</p></div><div className="scam-content"><div className="info-banner"><p><strong>Your Information is Confidential:</strong> Reports are handled securely. Never submit passwords, OTPs, PINs, or authentication secrets.</p></div><form onSubmit={handleSubmit} className="scam-form"><section className="form-section"><h2>Your Information</h2><div className="form-group"><label htmlFor="reporterName">Full Name *</label><input id="reporterName" name="reporterName" value={formData.reporterName} onChange={handleChange} required maxLength="100" /></div><div className="form-row"><div className="form-group"><label htmlFor="reporterEmail">Email Address *</label><input type="email" id="reporterEmail" name="reporterEmail" value={formData.reporterEmail} onChange={handleChange} required maxLength="254" /></div><div className="form-group"><label htmlFor="reporterPhone">Phone Number</label><input type="tel" id="reporterPhone" name="reporterPhone" value={formData.reporterPhone} onChange={handleChange} maxLength="20" /></div></div></section><section className="form-section"><h2>Scam Details</h2><div className="form-group"><label htmlFor="scamType">Type of Scam *</label><select id="scamType" name="scamType" value={formData.scamType} onChange={handleChange} required><option value="">Select a scam type...</option><option value="phishing">🎣 Phishing</option><option value="fake-job">💼 Fake Job Offer</option><option value="romance-scam">💔 Romance Scam</option><option value="investment-fraud">📈 Investment Fraud</option><option value="upi-fraud">💳 UPI Fraud</option><option value="sms-scam">📱 SMS Scam</option><option value="call-fraud">☎️ Call Fraud</option><option value="other">🔍 Other</option></select></div><div className="form-group"><label htmlFor="scamDescription">Scam Description *</label><textarea id="scamDescription" name="scamDescription" value={formData.scamDescription} onChange={handleChange} rows="5" minLength="20" maxLength="2000" required /><span className="char-count">{formData.scamDescription.length}/2000 characters</span></div><div className="form-group"><label htmlFor="suspectDetails">Suspect Details</label><textarea id="suspectDetails" name="suspectDetails" value={formData.suspectDetails} onChange={handleChange} rows="4" maxLength="2000" /></div><div className="form-group"><label htmlFor="amountLost">Amount Lost (INR)</label><input type="number" id="amountLost" name="amountLost" value={formData.amountLost} onChange={handleChange} min="0" step="0.01" /></div></section><div className="form-disclaimer"><p><strong>Important:</strong> Submit truthful information and do not include authentication secrets.</p></div>{error && <p role="alert" className="required-message">{error}</p>}<button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? "Submitting securely..." : "Submit Report"}</button></form><section className="help-section"><h2>📚 Resources</h2><div className="resource-cards"><div className="resource-card"><h3>🛡️ Learn Protection</h3><p>Learn practical cyber-safety techniques.</p><button className="link-btn" onClick={() => navigate("/learn")}>Learn More</button></div><div className="resource-card"><h3>🚨 Need Immediate Help?</h3><p>Find emergency support information.</p><button className="link-btn" onClick={() => navigate("/emergency-help")}>Emergency Help</button></div><div className="resource-card"><h3>💬 Official Reporting</h3><p>Access the Government of India's cybercrime portal.</p><button className="link-btn" onClick={() => window.open("https://cybercrime.gov.in", "_blank", "noopener,noreferrer")}>Cybercrime Portal</button></div></div></section></div></div>;
}

export default ScamSolutions;
