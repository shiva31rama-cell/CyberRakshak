import { useNavigate } from "react-router-dom";
import "./SocialMediaSafety.css";

function SocialMediaSafety() {
  const navigate = useNavigate();

  return (
    <div className="module-container">
      <button className="back-button" onClick={() => navigate("/learn")}>
        ← Back to Learning Center
      </button>

      <div className="module-header">
        <h1>📱 Social Media Safety</h1>
        <p>Protect your privacy and stay safe on social platforms</p>
      </div>

      <div className="module-content">
        <section className="lesson-section">
          <h2>Why Social Media Safety Matters</h2>
          <p>
            Social media platforms are targets for scammers and hackers. Your
            personal information shared online can be exploited for fraud,
            identity theft, or harassment. Learning to use social media safely
            is essential.
          </p>
        </section>

        <section className="lesson-section">
          <h2>🔒 Essential Security Settings</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <h3>Privacy Settings</h3>
              <p>
                Set your profile to private. Control who can see your posts,
                photos, and personal information.
              </p>
            </div>

            <div className="setting-card">
              <h3>Two-Factor Authentication</h3>
              <p>
                Enable 2FA on all social media accounts. This adds a security
                layer even if your password is compromised.
              </p>
            </div>

            <div className="setting-card">
              <h3>Activity Status</h3>
              <p>
                Consider hiding your online status. This prevents people from
                knowing when you're using the app.
              </p>
            </div>

            <div className="setting-card">
              <h3>App Permissions</h3>
              <p>
                Review what permissions you've granted to apps. Remove access to
                camera, location, and contacts if not needed.
              </p>
            </div>

            <div className="setting-card">
              <h3>Login Activity</h3>
              <p>
                Regularly check where your account is being accessed from.
                Remove unrecognized devices.
              </p>
            </div>

            <div className="setting-card">
              <h3>Data Download</h3>
              <p>
                Know how to download your data. Some platforms let you export
                your information for backup.
              </p>
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <h2>✅ Best Practices</h2>
          <ul className="best-practices-list">
            <li>✓ Never accept friend requests from strangers</li>
            <li>
              ✓ Don't share personal information like your address or phone
            </li>
            <li>✓ Be cautious about what you post – think before you share</li>
            <li>
              ✓ Use strong, unique passwords for each social media account
            </li>
            <li>✓ Don't click suspicious links in messages or comments</li>
            <li>✓ Report accounts that are impersonating you</li>
            <li>
              ✓ Use private messaging instead of public comments for sensitive
              topics
            </li>
            <li>✓ Limit who can see your location and activity</li>
          </ul>
        </section>

        <section className="lesson-section warning">
          <h2>⚠️ Common Social Media Scams</h2>

          <div className="scam-alert">
            <h3>Romance Scams</h3>
            <p>
              Scammers create fake profiles to build relationships then ask for
              money. Be wary of rapid declarations of love.
            </p>
          </div>

          <div className="scam-alert">
            <h3>Impersonation</h3>
            <p>
              Someone creates a fake account using your photos and name. Report
              these accounts immediately.
            </p>
          </div>

          <div className="scam-alert">
            <h3>Prize/Gift Scams</h3>
            <p>
              You're told you've won a prize but need to pay to claim it or
              provide personal information. Legitimate prizes don't require
              payment.
            </p>
          </div>

          <div className="scam-alert">
            <h3>Phishing Links</h3>
            <p>
              Links in comments or DMs lead to fake login pages. Never enter
              your password on external websites.
            </p>
          </div>
        </section>

        <section className="lesson-section">
          <h2>🛑 What NOT to Share Online</h2>
          <div className="no-share-grid">
            <div className="no-share-item">❌ Your full date of birth</div>
            <div className="no-share-item">❌ Your home address</div>
            <div className="no-share-item">❌ Your phone number</div>
            <div className="no-share-item">❌ Banking information</div>
            <div className="no-share-item">❌ Your location in real-time</div>
            <div className="no-share-item">
              ❌ Travel plans before you leave
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <h2>✨ Tips for Teens and Young Adults</h2>
          <ul className="tips-list">
            <li>
              <strong>Think Before You Post:</strong> Once something is online,
              it can be shared and saved by anyone
            </li>
            <li>
              <strong>Know Your Friends:</strong> Meet people online before
              meeting them in person, if ever
            </li>
            <li>
              <strong>Report Bullying:</strong> Use the report feature and tell
              a trusted adult
            </li>
            <li>
              <strong>Manage Your Reputation:</strong> Google yourself and see
              what information is publicly available
            </li>
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

export default SocialMediaSafety;
