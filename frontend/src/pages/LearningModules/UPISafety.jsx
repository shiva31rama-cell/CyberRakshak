import { useNavigate } from "react-router-dom";
import "./UPISafety.css";

function UPISafety() {
  const navigate = useNavigate();

  return (
    <div className="module-container">
      <button className="back-button" onClick={() => navigate("/learn")}>
        ← Back to Learning Center
      </button>

      <div className="module-header">
        <h1>💳 UPI Safety Guide</h1>
        <p>Learn how to use UPI securely and avoid fraud</p>
      </div>

      <div className="module-content">
        <section className="lesson-section">
          <h2>What is UPI?</h2>
          <p>
            UPI (Unified Payments Interface) is a real-time payment system that
            allows you to transfer money instantly using your smartphone. It's
            convenient but requires careful security practices.
          </p>
        </section>

        <section className="lesson-section">
          <h2>🔐 UPI Security Best Practices</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>Never Share UPI PIN</h3>
              <p>
                Your UPI PIN is like your signature. Never share it with anyone,
                not even bank employees or support staff.
              </p>
            </div>

            <div className="tip-card">
              <h3>Verify Recipient</h3>
              <p>
                Always verify the recipient's details before sending money.
                Check the name and account carefully.
              </p>
            </div>

            <div className="tip-card">
              <h3>Use Secure WiFi</h3>
              <p>
                Only make UPI transactions on trusted WiFi networks. Avoid
                public WiFi for financial transactions.
              </p>
            </div>

            <div className="tip-card">
              <h3>Check Transaction Details</h3>
              <p>
                Review the amount and recipient before confirming. Look for
                typos or extra zeros.
              </p>
            </div>

            <div className="tip-card">
              <h3>Enable Two-Factor Authentication</h3>
              <p>
                Enable 2FA on your bank account for additional security. Use OTP
                verification.
              </p>
            </div>

            <div className="tip-card">
              <h3>Report Unauthorized Transactions</h3>
              <p>
                If you see unauthorized transactions, report them to your bank
                immediately.
              </p>
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <h2>⚠️ Common UPI Scams</h2>
          <div className="scam-card">
            <h3>1. Request Money Scam</h3>
            <p>
              Scammers send money requests claiming they sent money by mistake.
              They ask you to return it. Don't respond to unknown requests.
            </p>
          </div>

          <div className="scam-card">
            <h3>2. OTP Phishing</h3>
            <p>
              Attackers try to get your OTP through fake messages or calls.
              Never share your OTP with anyone for any reason.
            </p>
          </div>

          <div className="scam-card">
            <h3>3. Fake Payment Confirmations</h3>
            <p>
              You receive fake payment confirmation messages. Always check your
              bank app directly to verify transactions.
            </p>
          </div>

          <div className="scam-card">
            <h3>4. Screen Mirroring</h3>
            <p>
              Attackers gain remote access to your phone. Disable screen
              mirroring and unknown device connections.
            </p>
          </div>
        </section>

        <section className="lesson-section">
          <h2>✅ What to Do If You're Scammed</h2>
          <ol className="action-list">
            <li>Contact your bank immediately and freeze your account</li>
            <li>
              File a police report with details and transaction references
            </li>
            <li>
              Document all evidence including screenshots and transaction IDs
            </li>
            <li>Change your UPI PIN and passwords</li>
            <li>
              Monitor your account closely for further unauthorized activity
            </li>
            <li>Call cyber helpline 1930 for assistance</li>
          </ol>
        </section>

        <section className="lesson-section key-takeaway">
          <h2>🎯 Key Takeaways</h2>
          <ul>
            <li>Never share your UPI PIN, OTP, or CVV</li>
            <li>Verify all transaction details before confirming</li>
            <li>Use UPI only on secure networks and devices</li>
            <li>Enable all available security features on your bank app</li>
            <li>Act quickly if you suspect fraud</li>
          </ul>
        </section>
      </div>

      <div className="module-actions">
        <button
          className="quiz-btn"
          onClick={() => navigate("/digital-literacy-quiz")}
        >
          📝 Take Quiz
        </button>
      </div>
    </div>
  );
}

export default UPISafety;
