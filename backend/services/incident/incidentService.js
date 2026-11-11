const INCIDENT_GUIDANCE = {
  financial_fraud: {
    title: "Money or payment may be at risk",
    steps: [
      "Contact your bank, card issuer, wallet or payment provider immediately through its official channel.",
      "Preserve transaction IDs, timestamps, messages and screenshots.",
      "In India, use the official 1930 cyber-fraud reporting route or National Cyber Crime Reporting Portal as appropriate.",
    ],
  },
  account_compromise: {
    title: "Account security incident",
    steps: [
      "Use the affected service's official app or website to change the password if you still have access.",
      "Review active sessions/devices and enable multi-factor authentication where available.",
      "If locked out, use the service's official account-recovery process.",
    ],
  },
  phishing: {
    title: "Suspicious message or link",
    steps: [
      "Stop interacting with the message and do not provide additional information.",
      "If you clicked but did not submit secrets, close the page and continue with cautious account monitoring.",
      "If you entered credentials, use the service's official security/recovery flow.",
    ],
  },
  device_compromise: {
    title: "Suspicious device activity",
    steps: [
      "Stop interacting with unknown prompts or applications.",
      "Review recently installed apps and use the device's normal security tools.",
      "Install security updates from the official device/software provider.",
    ],
  },
  impersonation: {
    title: "Possible impersonation or social engineering",
    steps: [
      "End the suspicious conversation and independently contact the real organization/person.",
      "Preserve relevant messages, profiles, numbers or URLs if reporting may be needed.",
    ],
  },
  privacy: {
    title: "Possible personal-data exposure",
    steps: [
      "Secure affected accounts and enable multi-factor authentication where available.",
      "Watch for unexpected login, password-reset or financial alerts.",
      "Contact the affected service through its official security/support channel.",
    ],
  },
  general: {
    title: "Cyber-safety incident",
    steps: [
      "Pause further interaction and preserve relevant evidence.",
      "Secure the affected account/device using its official security controls.",
      "Use official reporting/help channels if money, identity or account access is at risk.",
    ],
  },
};

function buildIncidentPlan(type, description = "") {
  const incidentType = INCIDENT_GUIDANCE[type] ? type : "general";
  const guidance = INCIDENT_GUIDANCE[incidentType];
  const text = String(description).trim();
  return {
    incidentType,
    title: guidance.title,
    description: text ? text.slice(0, 1000) : null,
    safeActions: guidance.steps,
    evidenceToKeep: ["Relevant messages or emails", "Transaction/reference IDs when applicable", "Dates and approximate times", "URLs, usernames or phone numbers involved"],
    neverShare: ["Password", "OTP or one-time code", "UPI/card PIN", "CVV", "Recovery/backup code", "API key or authentication secret"],
    help: {
      india: "For cyber-fraud reporting in India, use the official National Cyber Crime Reporting Portal or 1930 where appropriate.",
      portal: "https://www.cybercrime.gov.in/",
      helpline: "1930",
    },
  };
}

module.exports = { buildIncidentPlan };
