import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./IncidentMode.css";

const SCENARIOS = [
  { id: "clicked", title: "I clicked a suspicious link", text: "You opened a link and are unsure what happened." },
  { id: "paid", title: "I sent money or approved a payment", text: "A UPI, card or bank payment may have gone to the wrong person." },
  { id: "shared", title: "I shared sensitive information", text: "You shared a password, OTP, identity detail or banking information." },
  { id: "installed", title: "I installed a suspicious app", text: "An unfamiliar APK or app was installed or requested unusual access." },
  { id: "account", title: "My account may be compromised", text: "You see unexpected logins, messages, settings or transactions." },
  { id: "message", title: "I received a suspicious message", text: "Nothing has happened yet, but the message looks suspicious." },
];

const ACTIONS = {
  clicked: ["Stop interacting with the page or sender.", "Do not enter passwords, OTPs, card details or UPI PINs.", "If you entered a password, change it from the service's official app or website.", "Check important accounts for unexpected activity."],
  paid: ["Do not send another payment to 'reverse' or 'unlock' the transaction.", "Contact your bank or payment provider through its official channel immediately.", "For suspected financial cyber fraud in India, use the official 1930 / cybercrime reporting route.", "Keep transaction IDs, screenshots and messages as evidence."],
  shared: ["Stop further communication with the requester.", "Change any exposed password from the official service.", "Never share another OTP, PIN or verification code to 'fix' the situation.", "Watch accounts connected to the information you shared."],
  installed: ["Do not grant additional permissions to the app.", "Disconnect from sensitive accounts on the device while you assess what happened.", "Use your device's official security controls to review and remove an untrusted app.", "Check financial and account activity for anything unexpected."],
  account: ["Use the service's official security page or app, not a link from a message.", "Change the password and review active sessions where the service supports it.", "Turn on stronger sign-in protection where available.", "Tell trusted contacts if messages may have been sent from your account."],
  message: ["Do not reply, click, pay or share verification codes.", "Verify the claim through an independent official channel.", "Save the message if you may need to report it.", "Run it through Check Center for a structured evidence review."],
};

function IncidentMode() {
  const [scenario, setScenario] = useState("");
  const steps = useMemo(() => ACTIONS[scenario] || [], [scenario]);

  return (
    <div className="incident-mode">
      <header className="incident-header">
        <span>INCIDENT MODE</span>
        <h1>Something happened. Let’s make the next move safer.</h1>
        <p>You do not need to diagnose the scam first. Choose what happened and follow the ordered recovery path.</p>
      </header>

      <section className="incident-grid" aria-label="Choose what happened">
        {SCENARIOS.map((item) => (
          <button key={item.id} type="button" className={scenario === item.id ? "incident-choice active" : "incident-choice"} onClick={() => setScenario(item.id)}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </button>
        ))}
      </section>

      {steps.length > 0 && (
        <section className="recovery-panel" aria-live="polite">
          <div className="recovery-heading">
            <span>NEXT SAFEST STEPS</span>
            <strong>Do these in order</strong>
          </div>
          <ol>
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <div className="recovery-links">
            <Link to="/emergency-help">Open official emergency resources →</Link>
            <Link to="/check">Check the original message or link →</Link>
            <Link to="/report-scam">Report / document the incident →</Link>
          </div>
        </section>
      )}

      <aside className="incident-note">
        <strong>Privacy reminder</strong>
        <p>Do not post passwords, OTPs, PINs, full card numbers or recovery codes into CyberRakshak. A safety tool should never need those secrets.</p>
      </aside>
    </div>
  );
}

export default IncidentMode;
