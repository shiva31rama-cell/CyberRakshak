import { useNavigate } from "react-router-dom";
import "./CyberCrimeAwareness.css";

function CyberCrimeAwareness() {
  const navigate = useNavigate();

  return (
    <div className="module-container">
      <button className="back-button" onClick={() => navigate("/learn")}>
        ← Back to Learning Center
      </button>

      <div className="module-header">
        <h1>🚨 Cyber Crime Awareness</h1>
        <p>Understand and protect yourself from common cyber crimes</p>
      </div>

      <div className="module-content">
        <section className="lesson-section">
          <h2>What is Cyber Crime?</h2>
          <p>
            Cyber crime refers to criminal activities carried out using
            computers or the internet. It includes identity theft, hacking,
            malware distribution, phishing, and fraud. Understanding these
            threats helps you protect yourself online.
          </p>
        </section>

        <section className="lesson-section">
          <h2>🎯 Common Types of Cyber Crimes</h2>

          <div className="crime-grid">
            <div className="crime-card">
              <h3>Phishing</h3>
              <p>
                Fraudulent attempts to obtain sensitive information by
                disguising as trustworthy entities in emails or websites.
              </p>
            </div>

            <div className="crime-card">
              <h3>Identity Theft</h3>
              <p>
                Criminals steal your personal information to impersonate you and
                commit fraud or access your accounts.
              </p>
            </div>

            <div className="crime-card">
              <h3>Ransomware</h3>
              <p>
                Malicious software that encrypts your files and demands payment
                for their release. Never pay ransom!
              </p>
            </div>

            <div className="crime-card">
              <h3>Online Fraud</h3>
              <p>
                Scams involving fake products, counterfeit goods, or false
                promises to deceive you out of money.
              </p>
            </div>

            <div className="crime-card">
              <h3>Hacking</h3>
              <p>
                Unauthorized access to your accounts or devices to steal data or
                cause damage.
              </p>
            </div>

            <div className="crime-card">
              <h3>Cyberstalking</h3>
              <p>
                Repeated harassment, threats, or surveillance of a person using
                digital technologies.
              </p>
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <h2>🛡️ Protection Strategies</h2>
          <div className="strategy-box">
            <h3>1. Keep Software Updated</h3>
            <p>
              Regularly update your operating system, browser, and applications.
              Updates patch security vulnerabilities.
            </p>
          </div>

          <div className="strategy-box">
            <h3>2. Use Strong Passwords</h3>
            <p>
              Create unique, complex passwords for each account. Use a password
              manager to keep track of them safely.
            </p>
          </div>

          <div className="strategy-box">
            <h3>3. Enable Multi-Factor Authentication</h3>
            <p>
              Use 2FA or MFA to add extra security layers to your important
              accounts.
            </p>
          </div>

          <div className="strategy-box">
            <h3>4. Be Suspicious of Unsolicited Messages</h3>
            <p>
              Don't click links or download attachments from unknown senders.
              Verify with the organization directly.
            </p>
          </div>

          <div className="strategy-box">
            <h3>5. Use Antivirus Software</h3>
            <p>
              Install reputable antivirus and anti-malware software on all your
              devices.
            </p>
          </div>

          <div className="strategy-box">
            <h3>6. Backup Your Data</h3>
            <p>
              Regularly backup important files to protect against data loss from
              ransomware or hardware failure.
            </p>
          </div>
        </section>

        <section className="lesson-section warning">
          <h2>⚠️ Red Flags to Watch For</h2>
          <ul className="red-flags">
            <li>Unexpected emails asking for personal information</li>
            <li>Links from unknown sources or shortened URLs</li>
            <li>Requests for payment via gift cards or cryptocurrency</li>
            <li>Suspicious attachments from unfamiliar senders</li>
            <li>Too-good-to-be-true offers or prizes</li>
            <li>Urgent messages creating pressure to act quickly</li>
            <li>Typos and grammatical errors in official messages</li>
            <li>Pop-ups warning about security threats</li>
          </ul>
        </section>

        <section className="lesson-section">
          <h2>📞 If You're a Victim</h2>
          <ol className="victim-steps">
            <li>
              <strong>Act Immediately:</strong> Don't wait. The faster you act,
              the better.
            </li>
            <li>
              <strong>Change Passwords:</strong> Change all passwords on
              affected accounts.
            </li>
            <li>
              <strong>Contact Your Bank:</strong> Inform your bank if financial
              accounts are compromised.
            </li>
            <li>
              <strong>File a Report:</strong> Report to police and cyber crime
              authorities.
            </li>
            <li>
              <strong>Monitor Accounts:</strong> Keep a close eye on accounts
              for suspicious activity.
            </li>
            <li>
              <strong>Seek Help:</strong> Call cyber helpline 1930 for support.
            </li>
          </ol>
        </section>

        <section className="lesson-section">
          <h2>🎯 Remember</h2>
          <p>
            Cyber security is everyone's responsibility. Stay informed, remain
            vigilant, and don't hesitate to report suspicious activity. Your
            actions can help protect yourself and others from cyber crimes.
          </p>
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

export default CyberCrimeAwareness;
