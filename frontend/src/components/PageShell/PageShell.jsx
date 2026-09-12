import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PageShell.css";

const PAGE_META = {
  "/": { title: "CyberRakshak", subtitle: "Simple, explainable cyber-safety for everyday digital life." },
  "/check": { title: "Safety Checker", subtitle: "Check a suspicious message or link and understand the warning signs." },
  "/learn": { title: "Learn Cyber Safety", subtitle: "Short lessons and practical habits without technical jargon." },
  "/digital-literacy": { title: "Digital Literacy", subtitle: "Build safer everyday digital skills one topic at a time." },
  "/digital-literacy-quiz": { title: "Cyber Safety Quiz", subtitle: "Test what you learned with simple scenario-based questions." },
  "/emergency-help": { title: "Emergency Help", subtitle: "Follow the safest next steps when something has already gone wrong." },
  "/report-scam": { title: "Report a Scam", subtitle: "Record what happened and understand the official reporting path." },
  "/feedback": { title: "Feedback", subtitle: "Tell us what is useful, confusing or missing." },
  "/admin": { title: "Security Operations", subtitle: "Authorized administrative view for reports, signals and feedback." }
};

function titleFromPath(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith("/upi-safety")) return { title: "UPI Safety", subtitle: "Safer payment habits and warning signs." };
  if (pathname.startsWith("/cyber-crime-awareness")) return { title: "Cyber Crime Awareness", subtitle: "Understand common cybercrime patterns and safer responses." };
  if (pathname.startsWith("/social-media-safety")) return { title: "Social Media Safety", subtitle: "Protect accounts, identity and conversations." };
  if (pathname.startsWith("/password-security")) return { title: "Password Security", subtitle: "Create stronger account-protection habits." };
  if (pathname.startsWith("/login")) return { title: "Login", subtitle: "Access your CyberRakshak account." };
  if (pathname.startsWith("/register")) return { title: "Create Account", subtitle: "Start your safer digital-learning journey." };
  return { title: "CyberRakshak", subtitle: "Cyber-safety guidance made easier to understand." };
}

export default function PageShell({ children }) {
  const location = useLocation();
  const meta = titleFromPath(location.pathname);

  useEffect(() => {
    document.title = `${meta.title} | CyberRakshak`;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, meta.title]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {location.pathname !== "/" && (
        <header className="page-shell-header" aria-labelledby="page-title">
          <div className="page-shell-inner">
            <span className="page-shell-kicker">CYBERRAKSHAK</span>
            <h1 id="page-title">{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
        </header>
      )}
      <div id="main-content" className="page-shell-content">
        {children}
      </div>
    </>
  );
}
