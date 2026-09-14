const OFFICIAL_RESOURCES = {
  indiaFinancialFraud: {
    id: "india-financial-fraud",
    title: "India financial cyber-fraud reporting",
    label: "1930 / National Cyber Crime Reporting Portal",
    url: "https://www.cybercrime.gov.in/",
    note: "Use official channels for suspected financial cyber fraud. Keep transaction references and evidence ready.",
  },
  cybercrimePortal: {
    id: "india-cybercrime-portal",
    title: "National Cyber Crime Reporting Portal",
    label: "cybercrime.gov.in",
    url: "https://www.cybercrime.gov.in/",
    note: "Use the official portal to report cybercrime and access government cyber-safety services.",
  },
  sancharSaathi: {
    id: "sanchar-saathi",
    title: "Sanchar Saathi",
    label: "Official telecom-safety services",
    url: "https://www.sancharsaathi.gov.in/",
    note: "Use official telecom tools when the incident involves a mobile number or telecom-related concern.",
  },
};

const PLANS = {
  clicked: {
    title: "You clicked a suspicious link",
    urgency: "high",
    summary: "The safest next step is to stop interacting with the page and protect any account information that may have been exposed.",
    immediate: [
      "Close the suspicious page and do not follow additional prompts.",
      "Do not enter or send passwords, OTPs, PINs, card details or recovery codes.",
      "If you entered a password, change it using the service's official app or website.",
    ],
    verify: [
      "Review recent sign-ins and important account activity.",
      "Check whether any unexpected downloads or app-install prompts appeared.",
      "Preserve the suspicious URL and screenshots without reopening the link.",
    ],
    resources: [OFFICIAL_RESOURCES.cybercrimePortal],
  },
  paid: {
    title: "You sent money or approved a payment",
    urgency: "critical",
    summary: "Treat a suspicious payment as time-sensitive. Do not make another payment to reverse, unlock or verify the first one.",
    immediate: [
      "Stop communicating with the requester and do not send another payment.",
      "Contact your bank or payment provider through its official app, website or support number.",
      "For suspected financial cyber fraud in India, use the official 1930 / cybercrime reporting route as soon as possible.",
    ],
    verify: [
      "Record the transaction ID, amount, date/time and recipient details.",
      "Save relevant messages, screenshots and payment confirmations.",
      "Monitor the account for additional unexpected transactions.",
    ],
    resources: [OFFICIAL_RESOURCES.indiaFinancialFraud],
  },
  shared: {
    title: "You shared sensitive information",
    urgency: "critical",
    summary: "Protect the exposed account or service first. CyberRakshak should never require you to paste the secret itself.",
    immediate: [
      "Stop further communication with the requester.",
      "Change any exposed password from the official service.",
      "Never share another OTP, PIN, password or recovery code to 'fix' the incident.",
    ],
    verify: [
      "Review active sessions, recovery methods and recent security activity where available.",
      "Check financial accounts if banking or payment information was exposed.",
      "Tell trusted contacts if your account could be used to impersonate you.",
    ],
    resources: [OFFICIAL_RESOURCES.cybercrimePortal],
  },
  installed: {
    title: "You installed a suspicious app",
    urgency: "critical",
    summary: "Avoid granting additional access while you assess the app. Use the device's official security controls for removal and account protection.",
    immediate: [
      "Do not grant additional permissions to the app.",
      "Review the app's permissions and remove the app using your device's normal security controls if it is untrusted.",
      "Change important passwords from a trusted device if you believe the app could have exposed them.",
    ],
    verify: [
      "Review accessibility, notification, SMS, device-admin and other sensitive permissions where your device exposes them.",
      "Check banking and account activity for unexpected changes.",
      "Keep the suspicious app name, source and screenshots for reporting if needed.",
    ],
    resources: [OFFICIAL_RESOURCES.cybercrimePortal, OFFICIAL_RESOURCES.sancharSaathi],
  },
  account: {
    title: "Your account may be compromised",
    urgency: "critical",
    summary: "Use the service's official security controls to regain control and invalidate suspicious access.",
    immediate: [
      "Open the service through its official app or website, not a message link.",
      "Change the password and sign out unfamiliar sessions where supported.",
      "Enable stronger sign-in protection where available.",
    ],
    verify: [
      "Review recovery email/phone, security settings and recent activity.",
      "Check whether unexpected messages were sent from the account.",
      "Warn trusted contacts if impersonation is possible.",
    ],
    resources: [OFFICIAL_RESOURCES.cybercrimePortal],
  },
  message: {
    title: "You received a suspicious message",
    urgency: "caution",
    summary: "No action has to be taken just because a message creates urgency. Verify the claim independently before doing anything.",
    immediate: [
      "Do not reply, click, pay or share verification codes.",
      "Verify the claim through an independently opened official channel.",
      "Keep the message if you may need it for reporting.",
    ],
    verify: [
      "Run the message, link or identifier through Check Center.",
      "Look for pressure, unusual payment requests, impersonation and requests for secrecy.",
      "Block or report the sender using the platform's normal controls when appropriate.",
    ],
    resources: [OFFICIAL_RESOURCES.cybercrimePortal],
  },
};

const getRecoveryPlan = (scenario) => PLANS[scenario] || null;

const getRecoveryScenarios = () => Object.entries(PLANS).map(([id, plan]) => ({
  id,
  title: plan.title,
  urgency: plan.urgency,
  summary: plan.summary,
}));

module.exports = { getRecoveryPlan, getRecoveryScenarios, OFFICIAL_RESOURCES };
