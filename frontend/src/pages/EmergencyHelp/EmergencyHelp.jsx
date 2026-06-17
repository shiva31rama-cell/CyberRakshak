import { useNavigate } from "react-router-dom";
import "./EmergencyHelp.css";

function EmergencyHelp() {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      title: "Cyber Crime Helpline",
      number: "1930",
      description: "Report cyber crimes and get assistance from authorities",
      icon: "📱",
    },
    {
      title: "Police Emergency",
      number: "100",
      description: "General emergency services and crime reporting",
      icon: "🚔",
    },
    {
      title: "Women's Helpline",
      number: "1091",
      description: "Support for women facing harassment or abuse",
      icon: "👩",
    },
    {
      title: "Ambulance/Medical",
      number: "102",
      description: "Medical emergencies and ambulance services",
      icon: "🚑",
    },
    {
      title: "Fire Emergency",
      number: "101",
      description: "Fire department and firefighting services",
      icon: "🚒",
    },
    {
      title: "RBI Cyber Fraud",
      number: "https://cybercrime.gov.in",
      description: "Report cyber fraud to RBI and authorities",
      icon: "🏦",
    },
  ];

  const quickActions = [
    {
      title: "Report a Scam",
      description: "Document and report fraudulent activities",
      icon: "⚠️",
      action: () => navigate("/report-scam"),
    },
    {
      title: "Contact Authorities",
      description: "File a formal complaint with cyber police",
      icon: "📋",
      action: () => {
        window.open("https://cybercrime.gov.in", "_blank");
      },
    },
    {
      title: "Bank Support",
      description: "Contact your bank for compromised accounts",
      icon: "🏦",
      action: () => alert("Call your bank's customer service number"),
    },
    {
      title: "Learn Prevention",
      description: "Learn how to prevent cyber crimes",
      icon: "📚",
      action: () => navigate("/learn"),
    },
  ];

  const stepsTake = [
    {
      number: 1,
      title: "Stop the Activity",
      description:
        "Disconnect from the internet if you suspect an ongoing breach",
    },
    {
      number: 2,
      title: "Document Everything",
      description: "Take screenshots of scam messages, emails, or websites",
    },
    {
      number: 3,
      title: "Change Passwords",
      description: "Change passwords on all affected accounts immediately",
    },
    {
      number: 4,
      title: "Contact Your Bank",
      description: "Inform your bank if financial accounts are compromised",
    },
    {
      number: 5,
      title: "File a Report",
      description: "Report to cyber police and keep the case number",
    },
    {
      number: 6,
      title: "Monitor Accounts",
      description: "Keep a close eye on your accounts for suspicious activity",
    },
  ];

  return (
    <div className="emergency-container">
      <div className="emergency-header">
        <h1>🚨 Emergency Help</h1>
        <p>Get immediate assistance if you're a victim of cyber crime</p>
      </div>

      <div className="emergency-content">
        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={action.action}
              >
                <span className="action-icon">{action.icon}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="emergency-contacts-section">
          <h2>📞 Emergency Contacts</h2>
          <div className="contacts-grid">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-card">
                <span className="contact-icon">{contact.icon}</span>
                <h3>{contact.title}</h3>
                <p className="contact-desc">{contact.description}</p>
                <p className="contact-number">
                  {contact.number.startsWith("http") ? (
                    <a
                      href={contact.number}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contact.number}
                    </a>
                  ) : (
                    <a href={`tel:${contact.number}`}>{contact.number}</a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps to Take */}
        <section className="steps-section">
          <h2>📋 Steps to Take If You're a Victim</h2>
          <div className="steps-grid">
            {stepsTake.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Information */}
        <section className="info-section">
          <div className="info-box warning">
            <h3>⚠️ Important Warning</h3>
            <p>
              <strong>Never pay money in advance</strong> to anyone claiming to
              be from a government agency or bank. Legitimate authorities don't
              demand payment via gift cards, cryptocurrency, or wire transfers.
            </p>
          </div>

          <div className="info-box tip">
            <h3>💡 Did You Know?</h3>
            <p>
              Cyber criminals often impersonate government officials or police.
              If you receive suspicious calls or messages, hang up and call the
              official number directly from a trusted source.
            </p>
          </div>

          <div className="info-box help">
            <h3>🤝 Getting Help</h3>
            <p>
              Don't hesitate to reach out for help. Cyber crime is not your
              fault. Contact local authorities, your bank, or NGOs that provide
              victim support. Mental health support is also important – talk to
              someone you trust.
            </p>
          </div>
        </section>

        {/* Useful Resources */}
        <section className="resources-section">
          <h2>📚 Useful Resources</h2>
          <div className="resources-list">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              🌐 Indian Cyber Crime Coordination Centre
            </a>
            <a
              href="https://www.ncsc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              🛡️ National Cyber Security Centre of India
            </a>
            <a
              href="https://www.identitytheft.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              🆔 Identity Theft Resources
            </a>
            <a
              href="https://www.consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              📞 How to Report Spam
            </a>
          </div>
        </section>
      </div>

      <button className="back-home-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default EmergencyHelp;
