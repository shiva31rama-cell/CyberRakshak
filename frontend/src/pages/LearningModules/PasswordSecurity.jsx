import { useNavigate } from "react-router-dom";
import "./PasswordSecurity.css";

function PasswordSecurity() {
  const navigate = useNavigate();

  return (
    <div className="module-container">
      <button className="back-button" onClick={() => navigate("/learn")}>
        ← Back to Learning Center
      </button>

      <div className="module-header">
        <h1>🔐 Password Security</h1>
        <p>Create and manage strong passwords to protect your accounts</p>
      </div>

      <div className="module-content">
        <section className="lesson-section">
          <h2>Why Strong Passwords Matter</h2>
          <p>
            Your password is the first line of defense against unauthorized
            access to your accounts. A weak password can be cracked in seconds
            by hackers. Strong passwords protect your personal data, financial
            information, and identity.
          </p>
        </section>

        <section className="lesson-section">
          <h2>✅ Characteristics of Strong Passwords</h2>
          <div className="criteria-grid">
            <div className="criteria-card strong">
              <h3>✓ At Least 12 Characters</h3>
              <p>
                The longer the password, the harder it is to crack. Aim for
                12-16 characters.
              </p>
            </div>

            <div className="criteria-card strong">
              <h3>✓ Mix of Character Types</h3>
              <p>
                Use uppercase, lowercase, numbers, and special characters
                (!@#$%^&*).
              </p>
            </div>

            <div className="criteria-card strong">
              <h3>✓ No Personal Information</h3>
              <p>
                Don't use names, birthdates, or pet names that can be easily
                guessed.
              </p>
            </div>

            <div className="criteria-card strong">
              <h3>✓ Unique for Each Account</h3>
              <p>
                Use different passwords for each account. If one is compromised,
                others remain safe.
              </p>
            </div>

            <div className="criteria-card weak">
              <h3>❌ Dictionary Words</h3>
              <p>Avoid common words. Hackers use dictionary attacks.</p>
            </div>

            <div className="criteria-card weak">
              <h3>❌ Obvious Patterns</h3>
              <p>
                Avoid patterns like "123456" or "qwerty" – these are among the
                first things hackers try.
              </p>
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <h2>📝 Password Examples</h2>

          <div className="example-box weak-example">
            <h4>❌ WEAK PASSWORDS</h4>
            <ul>
              <li>password123</li>
              <li>qwerty</li>
              <li>123456</li>
              <li>admin</li>
              <li>abc123</li>
              <li>your birth year or name</li>
            </ul>
          </div>

          <div className="example-box strong-example">
            <h4>✓ STRONG PASSWORDS</h4>
            <ul>
              <li>B7@mP!kx9$Qv2N</li>
              <li>Tr0p!cal&Summer#2024</li>
              <li>D3v@l0p3r#Success</li>
              <li>C0rps3M@ngling94!</li>
              <li>F1r3w@ll&SecureN3t</li>
              <li>M00nLight#Dancing&Stars</li>
            </ul>
          </div>
        </section>

        <section className="lesson-section">
          <h2>🛠️ Password Management Tips</h2>

          <div className="tip-full">
            <h3>1. Use a Password Manager</h3>
            <p>
              Password managers like Bitwarden, 1Password, or LastPass securely
              store your passwords. You only need to remember one master
              password.
            </p>
          </div>

          <div className="tip-full">
            <h3>2. Never Write Down Passwords</h3>
            <p>
              Avoid writing passwords on sticky notes or notebooks. Use a
              password manager instead.
            </p>
          </div>

          <div className="tip-full">
            <h3>3. Don't Share Your Passwords</h3>
            <p>
              Never share passwords with anyone, including family, friends, or
              IT support. Legitimate companies will never ask for your password.
            </p>
          </div>

          <div className="tip-full">
            <h3>4. Change Passwords Regularly</h3>
            <p>
              Change passwords for critical accounts (email, banking) every 3-6
              months or immediately if you suspect a breach.
            </p>
          </div>

          <div className="tip-full">
            <h3>5. Use Two-Factor Authentication</h3>
            <p>
              Even if your password is compromised, 2FA prevents unauthorized
              access. Enable it on all important accounts.
            </p>
          </div>

          <div className="tip-full">
            <h3>6. Check if Your Account Was Breached</h3>
            <p>
              Visit haveibeenpwned.com to check if your email has appeared in
              known data breaches. Change passwords immediately if it has.
            </p>
          </div>
        </section>

        <section className="lesson-section warning">
          <h2>🚨 What to Do If Your Password is Compromised</h2>
          <ol className="action-steps">
            <li>Change the password immediately</li>
            <li>
              Change passwords on other accounts that use similar passwords
            </li>
            <li>Enable two-factor authentication if not already enabled</li>
            <li>Monitor your accounts for unauthorized activity</li>
            <li>Check credit reports for identity theft</li>
            <li>Contact your bank if financial accounts are affected</li>
          </ol>
        </section>

        <section className="lesson-section">
          <h2>🎯 Password Security Checklist</h2>
          <ul className="checklist">
            <li>☐ Create passwords with at least 12 characters</li>
            <li>☐ Mix uppercase, lowercase, numbers, and special characters</li>
            <li>☐ Use unique passwords for each account</li>
            <li>☐ Avoid personal information and dictionary words</li>
            <li>☐ Use a password manager</li>
            <li>☐ Enable two-factor authentication</li>
            <li>☐ Change passwords for critical accounts regularly</li>
            <li>☐ Never share your password</li>
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

export default PasswordSecurity;
