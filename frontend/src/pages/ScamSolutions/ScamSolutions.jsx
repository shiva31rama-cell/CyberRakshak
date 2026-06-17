import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScamSolutions.css";

function ScamSolutions() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
    scamType: "",
    scamDescription: "",
    suspectDetails: "",
    amountLost: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scamTypes = [
    "phishing",
    "fake-job",
    "romance-scam",
    "investment-fraud",
    "upi-fraud",
    "sms-scam",
    "call-fraud",
    "other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      // const response = await fetch('/api/scam-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // For demo purposes, generate a case number
      const caseNum = `CASE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setCaseNumber(caseNum);
      setSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          reporterName: "",
          reporterEmail: "",
          reporterPhone: "",
          scamType: "",
          scamDescription: "",
          suspectDetails: "",
          amountLost: "",
        });
      }, 3000);
    } catch (error) {
      alert("Error submitting report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="scam-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h1>Report Submitted Successfully!</h1>
          <p>
            Thank you for reporting this scam. Your case has been registered.
          </p>

          <div className="case-info">
            <p>Your Case Number:</p>
            <p className="case-number">{caseNumber}</p>
            <p className="case-note">
              Please save this number for future reference. Use it to track the
              status of your report.
            </p>
          </div>

          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li>✓ Our team will review your report within 24-48 hours</li>
              <li>✓ You may be contacted for additional information</li>
              <li>
                ✓ Your information will be forwarded to relevant authorities
              </li>
              <li>✓ Keep your case number safe for reference</li>
            </ul>
          </div>

          <div className="success-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
            <button
              className="action-btn secondary"
              onClick={() => navigate("/emergency-help")}
            >
              Emergency Help
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scam-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="scam-header">
        <h1>⚠️ Report a Scam</h1>
        <p>Help us fight cybercrime by reporting fraudulent activities</p>
      </div>

      <div className="scam-content">
        <div className="info-banner">
          <p>
            <strong>Your Information is Confidential:</strong> All reports are
            kept confidential and used only to investigate and prevent scams.
            Your safety is our priority.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="scam-form">
          <section className="form-section">
            <h2>Your Information</h2>

            <div className="form-group">
              <label htmlFor="reporterName">Full Name *</label>
              <input
                type="text"
                id="reporterName"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reporterEmail">Email Address *</label>
                <input
                  type="email"
                  id="reporterEmail"
                  name="reporterEmail"
                  value={formData.reporterEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reporterPhone">Phone Number</label>
                <input
                  type="tel"
                  id="reporterPhone"
                  name="reporterPhone"
                  value={formData.reporterPhone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Scam Details</h2>

            <div className="form-group">
              <label htmlFor="scamType">Type of Scam *</label>
              <select
                id="scamType"
                name="scamType"
                value={formData.scamType}
                onChange={handleChange}
                required
              >
                <option value="">Select a scam type...</option>
                <option value="phishing">🎣 Phishing</option>
                <option value="fake-job">💼 Fake Job Offer</option>
                <option value="romance-scam">💔 Romance Scam</option>
                <option value="investment-fraud">📈 Investment Fraud</option>
                <option value="upi-fraud">💳 UPI Fraud</option>
                <option value="sms-scam">📱 SMS Scam</option>
                <option value="call-fraud">☎️ Call Fraud</option>
                <option value="other">🔍 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="scamDescription">Scam Description *</label>
              <textarea
                id="scamDescription"
                name="scamDescription"
                value={formData.scamDescription}
                onChange={handleChange}
                placeholder="Please describe the scam in detail. Include what happened, when, and how you were contacted."
                rows="5"
                minLength="20"
                required
              ></textarea>
              <span className="char-count">
                {formData.scamDescription.length}/2000 characters
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="suspectDetails">Suspect Details</label>
              <textarea
                id="suspectDetails"
                name="suspectDetails"
                value={formData.suspectDetails}
                onChange={handleChange}
                placeholder="Any details about the scammer? Name, account number, phone number, website, social media profile, etc."
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="amountLost">Amount Lost (in INR)</label>
              <input
                type="number"
                id="amountLost"
                name="amountLost"
                value={formData.amountLost}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </section>

          <div className="form-disclaimer">
            <p>
              <strong>Important:</strong> By submitting this report, you confirm
              that the information provided is true and accurate to the best of
              your knowledge. False reports may be subject to legal action.
            </p>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        <section className="help-section">
          <h2>📚 Resources</h2>
          <div className="resource-cards">
            <div className="resource-card">
              <h3>🛡️ How to Protect Yourself</h3>
              <p>Learn prevention techniques in our Learning Center</p>
              <button className="link-btn" onClick={() => navigate("/learn")}>
                Learn More
              </button>
            </div>

            <div className="resource-card">
              <h3>🚨 Need Immediate Help?</h3>
              <p>Contact emergency services and authorities</p>
              <button
                className="link-btn"
                onClick={() => navigate("/emergency-help")}
              >
                Emergency Contacts
              </button>
            </div>

            <div className="resource-card">
              <h3>💬 Report to Authorities</h3>
              <p>Visit the Indian Cyber Crime Coordination Centre</p>
              <button
                className="link-btn"
                onClick={() =>
                  window.open("https://cybercrime.gov.in", "_blank")
                }
              >
                ICCC Portal
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ScamSolutions;
