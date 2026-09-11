const normalizeText = (value = "") => String(value)
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const patterns = [
  {
    id: "otp-request",
    category: "credential-theft",
    weight: 28,
    keywords: ["otp", "one time password", "verification code", "cvv", "upi pin", "atm pin"],
    reason: "Requests a security code or financial credential that should never be shared."
  },
  {
    id: "urgent-threat",
    category: "social-engineering",
    weight: 18,
    keywords: ["urgent", "immediately", "within 10 minutes", "account blocked", "account suspended", "last warning", "legal action"],
    reason: "Uses urgency or fear to pressure the user into acting before verifying."
  },
  {
    id: "impersonation",
    category: "impersonation",
    weight: 20,
    keywords: ["bank", "police", "cyber crime", "income tax", "customs", "courier", "aadhaar", "uidai", "rbi", "government", "kyc"],
    reason: "Claims to represent a trusted institution and may be using authority to build false trust."
  },
  {
    id: "payment-request",
    category: "financial-fraud",
    weight: 24,
    keywords: ["pay", "payment", "transfer", "send money", "deposit", "processing fee", "registration fee", "security deposit", "upi", "collect request"],
    reason: "Contains a financial request that deserves independent verification before any payment."
  },
  {
    id: "remote-access",
    category: "device-compromise",
    weight: 30,
    keywords: ["anydesk", "teamviewer", "remote access", "screen sharing", "install this app", "apk", "download this app"],
    reason: "Requests remote access or software installation that can expose the device or accounts."
  },
  {
    id: "job-scam",
    category: "fake-job",
    weight: 20,
    keywords: ["work from home", "captcha job", "job offer", "joining fee", "salary", "investment task", "telegram job", "whatsapp job"],
    reason: "Matches common fake-job or task-based scam language."
  },
  {
    id: "digital-arrest",
    category: "digital-arrest",
    weight: 34,
    keywords: ["digital arrest", "video call with police", "money for verification", "stay on video call", "case against you", "arrest warrant"],
    reason: "Matches a high-risk impersonation pattern associated with digital-arrest scams."
  },
  {
    id: "sim-swap",
    category: "sim-swap",
    weight: 30,
    keywords: ["sim replacement", "sim swap", "esim", "sim blocked", "sim deactivated", "network stopped", "port your number", "number porting"],
    reason: "Mentions mobile-number takeover or SIM/eSIM changes that can affect account recovery."
  }
];

const urlPatterns = [
  { regex: /https?:\/\/[^\s]+/g, id: "contains-url", weight: 6, reason: "Contains a link that should be independently verified before opening." },
  { regex: /@/g, id: "at-sign-in-url", weight: 12, reason: "A URL with an @ character can obscure the real destination. Verify the hostname carefully." },
  { regex: /(?:xn--)/i, id: "punycode", weight: 18, reason: "Punycode domains can be used for deceptive look-alike domains. Treat unfamiliar domains cautiously." },
  { regex: /(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly)\//i, id: "short-url", weight: 10, reason: "A shortened link hides the final destination and should be expanded/verified first." }
];

const clamp = (number, min = 0, max = 100) => Math.min(max, Math.max(min, number));

const levelForScore = (score) => {
  if (score >= 80) return { level: "critical", label: "CRITICAL", color: "red" };
  if (score >= 60) return { level: "high", label: "HIGH RISK", color: "orange" };
  if (score >= 35) return { level: "suspicious", label: "SUSPICIOUS", color: "amber" };
  if (score >= 15) return { level: "caution", label: "CAUTION", color: "yellow" };
  return { level: "low", label: "LOW RISK", color: "green" };
};

export const analyzeScamText = (value = "") => {
  const text = normalizeText(value);
  const signals = [];
  const categories = new Map();
  let score = 0;

  for (const pattern of patterns) {
    const found = pattern.keywords.find((keyword) => text.includes(keyword));
    if (found) {
      score += pattern.weight;
      signals.push({ id: pattern.id, title: pattern.category.replaceAll("-", " "), reason: pattern.reason, matched: found });
      categories.set(pattern.category, (categories.get(pattern.category) || 0) + 1);
    }
  }

  for (const pattern of urlPatterns) {
    if (pattern.regex.test(value)) {
      score += pattern.weight;
      signals.push({ id: pattern.id, title: pattern.id.replaceAll("-", " "), reason: pattern.reason });
    }
  }

  score = clamp(score);
  const rating = levelForScore(score);
  const topCategory = [...categories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown";

  const recommendedActions = score >= 60
    ? [
      "Do not share OTPs, PINs, passwords, CVV, or recovery codes.",
      "Do not send money until the request is independently verified.",
      "Do not install remote-access apps or follow suspicious links.",
      "Use the official app/site or a trusted phone number to verify the claim."
    ]
    : score >= 35
      ? [
        "Pause before responding.",
        "Verify the sender using an independent official channel.",
        "Do not share sensitive information or make a payment until verified."
      ]
      : [
        "No strong scam indicators were detected from the supplied text.",
        "Still verify unexpected requests before sharing sensitive information."
      ];

  return {
    success: true,
    score,
    ...rating,
    category: topCategory,
    confidence: signals.length >= 3 ? "high" : signals.length === 2 ? "medium" : "low",
    signals,
    recommendedActions,
    disclaimer: "This is a defensive risk assessment, not proof that a person, number, message, or website is fraudulent. Verify independently before taking action."
  };
};

export const extractUrls = (value = "") => String(value).match(/https?:\/\/[^\s]+/gi) || [];

export const analyzeUrl = (rawUrl = "") => {
  const input = String(rawUrl).trim();
  if (!input) return { success: false, message: "A URL is required." };

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return { success: false, message: "Enter a complete valid URL, including https:// when possible." };
  }

  const indicators = [];
  let score = 0;
  const hostname = parsed.hostname.toLowerCase();

  if (parsed.protocol !== "https:") {
    score += 20;
    indicators.push("The URL does not use HTTPS.");
  }
  if (hostname.includes("xn--")) {
    score += 18;
    indicators.push("The hostname uses punycode; verify that it is not a look-alike domain.");
  }
  if (parsed.username || parsed.password) {
    score += 25;
    indicators.push("The URL contains embedded user information before the hostname.");
  }
  if (hostname.split(".").length > 4) {
    score += 12;
    indicators.push("The hostname has unusually many subdomain levels.");
  }
  if (input.length > 180) {
    score += 8;
    indicators.push("The URL is unusually long; inspect the real hostname carefully.");
  }
  if (/[.@_-]{3,}/.test(hostname)) {
    score += 8;
    indicators.push("The hostname contains an unusual punctuation pattern.");
  }

  const knownShortener = /(^|\.)(bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly)$/i.test(hostname);
  if (knownShortener) {
    score += 10;
    indicators.push("This is a shortened-link service, so the final destination is hidden.");
  }

  const rating = levelForScore(clamp(score));
  return {
    success: true,
    score: clamp(score),
    ...rating,
    hostname,
    protocol: parsed.protocol.replace(":", ""),
    indicators,
    nextStep: rating.level === "low"
      ? "The URL does not show strong structural warning signs. Still verify the site and organization independently."
      : "Do not enter passwords, OTPs, banking details, or payment information until the destination is independently verified.",
    disclaimer: "URL structure alone cannot prove that a website is safe or malicious. Use trusted reputation/intelligence sources and independent verification for high-stakes decisions."
  };
};

export const supportedScamCategories = [
  "phishing",
  "smishing",
  "upi-fraud",
  "fake-job",
  "digital-arrest",
  "investment-fraud",
  "identity-impersonation",
  "sim-swap",
  "romance-scam",
  "shopping-scam",
  "tech-support",
  "social-media"
];
