const KNOWLEDGE_BASE = {
  phishing: {
    title: "Phishing and suspicious links",
    facts: [
      "Treat unexpected messages, links, attachments, and login requests with caution.",
      "Check the destination and sender independently instead of trusting urgency, branding, or a familiar-looking message.",
      "Do not enter passwords, OTPs, PINs, CVVs, or recovery codes into a page reached from an unexpected message."
    ],
    immediateActions: [
      "If you only received the message, avoid clicking the link or opening the attachment and verify through an official channel.",
      "If you clicked a link, do not enter additional information and tell CyberRakshak what happened so the risk can be assessed.",
      "If credentials were entered, use the affected service's official recovery/security flow and review active sessions where the service provides that option."
    ],
    avoid: [
      "Do not reply to a suspicious sender to ask whether the message is genuine.",
      "Do not download or install software because a message says your device is infected."
    ],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" },
      { label: "Cyber Crime Portal — Report Suspect", url: "https://cybercrime.gov.in/Webform/cyber_suspect.aspx" }
    ]
  },
  financial_fraud: {
    title: "Online financial fraud",
    facts: [
      "Fast reporting matters when money has been lost or an unauthorized payment is detected.",
      "Keep transaction details, timestamps, screenshots, and relevant messages available for the bank/payment provider and reporting process.",
      "Never share an OTP, UPI PIN, card PIN, CVV, password, or recovery code with a person claiming to help."
    ],
    immediateActions: [
      "Contact the bank, card issuer, wallet, or payment provider immediately using its official contact channel.",
      "In India, report cyber financial fraud through the official 1930 helpline or the National Cyber Crime Reporting Portal as appropriate.",
      "Preserve the original evidence and transaction information instead of deleting it."
    ],
    avoid: [
      "Do not send more money to a person who promises to reverse or recover the payment.",
      "Do not share banking credentials or authentication codes during a recovery call or chat."
    ],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" },
      { label: "Official cyber financial fraud reporting guidance", url: "https://cybercrime.gov.in/uploadmedia/instructions_citizenreportingcyberfrauds.pdf" }
    ]
  },
  account_compromise: {
    title: "Account compromise",
    facts: [
      "Unexpected login alerts, changed recovery details, or activity you did not perform can indicate an account-security problem, but one symptom alone does not prove an account was hacked.",
      "Use the affected service's official security and recovery pages rather than links supplied by an unknown sender."
    ],
    immediateActions: [
      "If you still have access, change the password from the service's official app or website and review active sessions/devices where available.",
      "Enable multi-factor authentication where available and secure the recovery email or phone number.",
      "If you are locked out, use the service's official account-recovery process."
    ],
    avoid: [
      "Do not share passwords, one-time codes, recovery codes, or backup codes with anyone, including CyberRakshak."
    ],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" },
      { label: "CERT-In", url: "https://www.cert-in.org.in/" }
    ]
  },
  device_compromise: {
    title: "Suspicious device activity",
    facts: [
      "Slow performance, battery drain, pop-ups, or a strange app can have many causes and do not by themselves prove that a device is hacked.",
      "Unexpected apps, account activity, or security alerts deserve closer inspection."
    ],
    immediateActions: [
      "Disconnect from a suspicious network or app session when appropriate and avoid interacting with unknown prompts.",
      "Review recently installed applications and remove only software you recognize as unwanted or unsafe, using the device's normal settings.",
      "Run the device's built-in security checks and install updates from the official device/software provider."
    ],
    avoid: [
      "Do not install remote-access or cleanup software because an unsolicited caller tells you to.",
      "Do not provide remote access or authentication codes to an unknown person."
    ],
    sources: [
      { label: "CERT-In", url: "https://www.cert-in.org.in/" },
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" }
    ]
  },
  malware: {
    title: "Malware awareness",
    facts: [
      "Malicious software can arrive through unsafe downloads, attachments, fake updates, or untrusted applications.",
      "The safest response depends on what was installed, what device is affected, and what activity was observed."
    ],
    immediateActions: [
      "Stop interacting with the suspicious file or application.",
      "Use the device's built-in security tools or reputable security software to check the device.",
      "Install operating-system and application security updates from official sources."
    ],
    avoid: [
      "Do not download a second unknown tool because a pop-up says it will remove the threat.",
      "Do not disable built-in security protections to make an unknown application run."
    ],
    sources: [
      { label: "CERT-In", url: "https://www.cert-in.org.in/" },
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" }
    ]
  },
  privacy: {
    title: "Privacy and data exposure",
    facts: [
      "A data leak or exposed personal information can increase the risk of impersonation, targeted scams, and unauthorized account attempts.",
      "The exact response depends on what information was exposed and which service was involved."
    ],
    immediateActions: [
      "Change affected account credentials if there is a credible account-security risk and enable multi-factor authentication where available.",
      "Watch for unexpected account alerts, password-reset messages, or financial activity.",
      "Contact the affected service through its official support or security channel when the exposure is confirmed."
    ],
    avoid: [
      "Do not post additional personal information publicly while trying to prove or investigate the leak."
    ],
    sources: [
      { label: "CERT-In", url: "https://www.cert-in.org.in/" },
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" }
    ]
  },
  impersonation: {
    title: "Impersonation and social engineering",
    facts: [
      "Scammers may pretend to be a bank, delivery service, official, colleague, friend, or support agent to pressure someone into an unsafe action.",
      "Urgency, secrecy, threats, or requests for authentication codes are strong reasons to stop and verify independently."
    ],
    immediateActions: [
      "End the suspicious interaction and contact the real organization through a trusted channel.",
      "Preserve relevant messages, numbers, profiles, or URLs if you may need to report the incident."
    ],
    avoid: [
      "Do not provide payment details, passwords, OTPs, or recovery codes to prove your identity to an unsolicited caller or chat."
    ],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" },
      { label: "National Cyber Crime Reporting Portal — Report Suspect", url: "https://cybercrime.gov.in/Webform/cyber_suspect.aspx" }
    ]
  },
  cyberbullying: {
    title: "Cyberbullying and online harassment",
    facts: [
      "Online harassment can involve repeated abusive messages, impersonation, threats, or other unwanted online behavior.",
      "The best reporting route depends on the platform and the nature of the incident."
    ],
    immediateActions: [
      "Use the platform's block, mute, privacy, and reporting controls where appropriate.",
      "Preserve relevant evidence such as dates, usernames, URLs, and screenshots where safe to do so.",
      "For serious threats or cybercrime concerns in India, use the official National Cyber Crime Reporting Portal or local emergency services as appropriate."
    ],
    avoid: [
      "Do not retaliate by exposing another person's private information or attempting unauthorized access to their account."
    ],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" }
    ]
  },
  general: {
    title: "General cyber safety",
    facts: [
      "Use unique passwords, enable multi-factor authentication where available, keep software updated, and verify unexpected requests independently.",
      "Never share passwords, OTPs, PINs, CVVs, recovery codes, or other authentication secrets."
    ],
    immediateActions: [
      "Pause before clicking unexpected links, opening attachments, sending money, or sharing personal information.",
      "Use official websites or apps when contacting a bank, platform, or government service."
    ],
    avoid: [],
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://www.cybercrime.gov.in/" },
      { label: "CERT-In", url: "https://www.cert-in.org.in/" }
    ]
  }
};

module.exports = KNOWLEDGE_BASE;
