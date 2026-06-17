import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About CyberRakshak</h3>
            <p>
              Empowering citizens with cyber security knowledge to stay safe
              online and protect themselves from digital threats.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/learn">Learning Center</a>
              </li>
              <li>
                <a href="/emergency-help">Emergency Help</a>
              </li>
              <li>
                <a href="/report-scam">Report Scam</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Emergency Contacts</h3>
            <ul>
              <li>🚨 Cyber Helpline: 1930</li>
              <li>📞 Police: 100</li>
              <li>🏥 Ambulance: 102</li>
              <li>🚒 Fire: 101</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                f
              </a>
              <a href="#" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" aria-label="Instagram">
                📷
              </a>
              <a href="#" aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p>
              &copy; {currentYear} CyberRakshak. All rights reserved. | Privacy
              Policy | Terms of Service
            </p>
          </div>
          <div className="footer-badges">
            <span className="badge">🔒 Secure</span>
            <span className="badge">✅ Verified</span>
            <span className="badge">🌍 Multi-language</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
