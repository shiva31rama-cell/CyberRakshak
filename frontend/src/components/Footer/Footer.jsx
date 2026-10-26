import { Link } from "react-router-dom";
import { requestOpenChatbot } from "../../utils/chatbotEvents";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <section className="footer-section">
            <h3>About CyberRakshak</h3>
            <p>
              Practical cyber-safety education and defensive guidance for suspicious messages,
              online risks, and cyber incidents.
            </p>
          </section>

          <nav className="footer-section" aria-label="Footer navigation">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/scan">Message Scanner</Link></li>
              <li><Link to="/scan/url">URL Scanner</Link></li>
              <li><Link to="/learn">Learning Center</Link></li>
            </ul>
          </nav>

          <section className="footer-section">
            <h3>Get help</h3>
            <p>Find defensive steps and official reporting resources for India.</p>
            <ul>
              <li><Link to="/incident">Incident Assistant</Link></li>
              <li><Link to="/emergency-help">Emergency Help</Link></li>
              <li><Link to="/report-scam">Submit a CyberRakshak Report</Link></li>
            </ul>
          </section>

          <section className="footer-section">
            <h3>Ask CyberRakshak</h3>
            <p>Describe a cyber-safety concern without sharing authentication secrets.</p>
            <button type="button" className="footer-chat-link" onClick={requestOpenChatbot}>
              Open the safety assistant
            </button>
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p>
              &copy; {currentYear} CyberRakshak. Educational guidance only; this is not a bank,
              police service, or government authority.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
