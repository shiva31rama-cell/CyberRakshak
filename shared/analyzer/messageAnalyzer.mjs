/**
 * CyberRakshak Suspicious Message Analyser — transparent rule-based baseline.
 *
 * This is NOT a machine-learning model. Each rule adds a documented weight to a
 * 0–100 risk score. The structure (extractFeatures → scoreRules → classify)
 * lets a trained classifier be plugged in later via `analyzeMessage(text, { classifier })`.
 * Text alone can never prove that a sender is genuine or authorised.
 */

export const MAX_MESSAGE_LENGTH = 5000;

const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "ow.ly", "shorturl.at", "tiny.cc", "rebrand.ly", "s.id", "t.ly", "bitly.com", "short.gy"];
const RISKY_TLDS = [".xyz", ".top", ".click", ".live", ".buzz", ".icu", ".rest", ".shop", ".info", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".link", ".cyou", ".sbs", ".monster"];
const BRANDS = ["sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe", "gpay", "googlepay", "amazon", "flipkart", "rbi", "npci", "uidai", "aadhaar", "incometax", "indiapost", "bluedart", "fedex", "dhl", "netflix", "whatsapp", "instagram", "facebook", "airtel", "jio", "bsnl", "irctc", "epfo"];
const OFFICIAL_DOMAINS = ["sbi.co.in", "onlinesbi.sbi", "hdfcbank.com", "icicibank.com", "axisbank.com", "kotak.com", "paytm.com", "phonepe.com", "amazon.in", "amazon.com", "flipkart.com", "rbi.org.in", "npci.org.in", "uidai.gov.in", "incometax.gov.in", "indiapost.gov.in", "irctc.co.in", "epfindia.gov.in", "airtel.in", "jio.com", "cybercrime.gov.in", "google.com", "netflix.com", "whatsapp.com"];

const has = (text, patterns) => patterns.some((p) => p.test(text));
const matches = (text, patterns) => {
  const found = new Set();
  for (const p of patterns) {
    const re = new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g");
    for (const m of text.matchAll(re)) if (m[0].trim()) found.add(m[0].trim().slice(0, 80));
  }
  return [...found];
};

/** Protective phrases used by genuine banks ("never share your OTP"). */
const PROTECTIVE = [/\b(do not|don't|dont|never|not to)\s+(share|disclose|tell|give)\b[^.]{0,40}\b(otp|pin|password|cvv)/i, /(otp|pin|password)[^.]{0,30}\b(do not|don't|never)\s+share/i, /ఎవరికీ\s*(చెప్పవద్దు|షేర్ చేయవద్దు)/];

const RULES = [
  {
    id: "otp_request", weight: 35, sensitive: true,
    patterns: [/\b(share|send|tell|provide|forward|give|read out|reply with)\b[^.\n]{0,40}\b(otp|one[- ]time password|verification code|code you (received|got))/i, /\botp\b[^.\n]{0,30}\b(share|send|tell|provide|forward|reply)\b/i, /ఓటీపీ[^.\n]{0,30}(చెప్పండి|పంపండి|షేర్)/],
  },
  {
    id: "credential_request", weight: 35, sensitive: true,
    patterns: [/\b(enter|share|send|provide|update|confirm|verify|submit)\b[^.\n]{0,40}\b(password|passcode|net ?banking|login details|cvv|card number|atm pin|debit card details|credit card details|bank details|account details|account number)/i, /\b(password|cvv|card number|bank details)\b[^.\n]{0,25}\b(required|needed|immediately)/i],
  },
  {
    id: "upi_pin_request", weight: 40, sensitive: true,
    patterns: [/\b(enter|share|type|provide)\b[^.\n]{0,30}\bupi ?pin\b/i, /\bupi ?pin\b[^.\n]{0,40}\b(receive|get|claim|refund|cashback)/i, /\b(scan|approve|accept)\b[^.\n]{0,40}\b(to receive|to get|for refund|for cashback)/i, /యూపీఐ\s*పిన్[^.\n]{0,30}(ఎంటర్|చెప్పండి)/],
  },
  {
    id: "lottery_prize", weight: 25,
    patterns: [/\b(congratulations|congrats)\b/i, /\byou (have )?(won|been selected|are (the )?(lucky )?winner)/i, /\b(lottery|lucky draw|jackpot|prize money|kbc|lucky winner|gift voucher worth|claim your (prize|reward|gift))/i, /(లాటరీ|బహుమతి గెలుచుకున్నారు|అభినందనలు)/],
  },
  {
    id: "unrealistic_amount", weight: 10,
    patterns: [/(₹|rs\.?|inr)\s?\d{1,3}(,\d{2,3})+(,\d{3})?/i, /\b\d+\s?(lakh|lakhs|crore|crores)\b/i, /(\$|usd)\s?\d{1,3}(,\d{3})+/i],
    when: (t) => has(t, [/\b(won|win|prize|reward|earn|profit|returns|cashback|salary|bonus)\b/i]),
  },
  {
    id: "urgency", weight: 12,
    patterns: [/\b(immediately|urgent(ly)?|right now|within \d+\s?(minutes?|mins?|hours?|hrs?)|today only|last chance|expires? (today|soon|in)|act now|asap|final (notice|warning)|before midnight)\b/i, /(వెంటనే|అత్యవసరం)/],
  },
  {
    id: "threat_language", weight: 18,
    patterns: [/\b(account|card|sim|number|kyc|pan|aadhaar)\b[^.\n]{0,30}\b(will be )?(blocked|suspended|deactivated|frozen|closed|terminated|disconnected)/i, /\b(arrest(ed)?|warrant|legal action|police case|fir|court notice|digital arrest|penalty|fine of)\b/i, /(బ్లాక్ చేయబడుతుంది|అరెస్ట్)/],
  },
  {
    id: "kyc_update", weight: 15,
    patterns: [/\b(update|complete|verify|re-?verify)\b[^.\n]{0,20}\b(kyc|pan|aadhaar)\b/i, /\bkyc\b[^.\n]{0,25}\b(expired|pending|incomplete|update)/i],
  },
  {
    id: "fake_job", weight: 20,
    patterns: [/\b(part[- ]time|work from home|home based) (job|work)\b/i, /\b(earn|salary|income)\b[^.\n]{0,25}(₹|rs\.?)?\s?\d[\d,]*\s?(per|\/|a)\s?(day|daily|hour|week)/i, /\b(like|rate|review)\b[^.\n]{0,20}\b(videos?|products?|hotels?)\b[^.\n]{0,20}\b(earn|paid|money)/i, /\b(no experience|no interview)\b[^.\n]{0,30}\b(required|needed|job)/i, /\btelegram\b[^.\n]{0,25}\b(task|job|work)/i],
  },
  {
    id: "investment_promise", weight: 22,
    patterns: [/\b(guaranteed|assured|fixed|risk[- ]free)\b[^.\n]{0,25}\b(returns?|profit|income)/i, /\b(double|triple)\b[^.\n]{0,20}\b(money|investment|amount)/i, /\b\d{2,3}\s?%\s?(returns?|profit)\b[^.\n]{0,20}\b(daily|weekly|monthly|in \d+ days)/i, /\b(crypto|forex|stock)\b[^.\n]{0,30}\b(tips|signals|vip group|guaranteed)/i],
  },
  {
    id: "unusual_payment", weight: 22,
    patterns: [/\b(registration|processing|activation|security|clearance|release|delivery|customs)\s(fee|charge|charges|amount)\b/i, /\b(pay|transfer|send)\b[^.\n]{0,30}\b(gift ?cards?|bitcoin|usdt|crypto|personal account|this upi id|below upi)/i, /\bpay\b[^.\n]{0,20}(₹|rs\.?)\s?\d+[^.\n]{0,30}\b(to (receive|claim|get|release|unlock))/i],
  },
  {
    id: "impersonation", weight: 12,
    patterns: [/\b(dear (customer|user|sir\/madam|account holder|valued customer))\b/i, /\b(from|this is)\b[^.\n]{0,15}\b(rbi|reserve bank|income tax|customs|cbi|police|cyber cell|trai|uidai|bank manager|customer care|head office)\b/i],
    when: (t) => has(t, [/\b(call|click|link|share|pay|send|update|verify|whatsapp)\b/i]),
  },
  {
    id: "suspicious_contact", weight: 12,
    patterns: [/\b(call|whatsapp|contact|message|reach)\b[^.\n]{0,25}(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/i, /\b(whatsapp|telegram)\b[^.\n]{0,20}\b(us|me|this number|on)\b/i],
  },
  {
    id: "remote_access_app", weight: 25,
    patterns: [/\b(anydesk|teamviewer|quick ?support|rustdesk|airdroid)\b/i, /\b(install|download)\b[^.\n]{0,30}\b(apk|app from (this|the) link)\b/i, /\.apk\b/i],
  },
  {
    id: "secrecy_request", weight: 15,
    patterns: [/\b(do not|don't) (tell|inform|share with) (anyone|your family|bank|police)\b/i, /\bkeep (this|it) (secret|confidential)\b/i],
  },
];

export function extractUrls(text) {
  const re = /\b((?:https?:\/\/|www\.)[^\s<>"')]+|(?:[a-z0-9-]+\.)+(?:com|in|net|org|co|xyz|top|click|live|info|ly|gl|gd|me|io|app|shop|link|site|online|tk|ml|cc|sbs|icu|buzz)(?:\/[^\s<>"')]*)?)/gi;
  return [...new Set((text.match(re) || []).map((u) => u.replace(/[.,!?;:]+$/, "")))].slice(0, 20);
}

const hostOf = (url) => {
  try { return new URL(/^https?:\/\//i.test(url) ? url : `http://${url}`).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; }
};

export function inspectUrl(url) {
  const host = hostOf(url);
  const reasons = [];
  if (!host) return { url, host: url, risk: "unknown", reasons: ["unparseable"] };
  const isOfficial = OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  if (SHORTENERS.includes(host)) reasons.push("shortener");
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) reasons.push("ip_address");
  if (host.startsWith("xn--") || host.includes(".xn--")) reasons.push("punycode");
  if (RISKY_TLDS.some((tld) => host.endsWith(tld))) reasons.push("risky_tld");
  if (!isOfficial && BRANDS.some((b) => host.replace(/[-.]/g, "").includes(b))) reasons.push("brand_lookalike");
  if ((host.match(/-/g) || []).length >= 2 || host.split(".").length > 4) reasons.push("complex_domain");
  if (/^http:\/\//i.test(url) && !isOfficial) reasons.push("no_https");
  if (/@/.test(url)) reasons.push("credential_in_url");
  const risk = isOfficial && reasons.length === 0 ? "known" : reasons.length >= 2 || reasons.includes("brand_lookalike") || reasons.includes("ip_address") ? "high" : reasons.length === 1 ? "medium" : "unverified";
  return { url, host, risk, official: isOfficial, reasons };
}

function grammarSignals(text) {
  const signals = [];
  const letters = text.replace(/[^A-Za-z]/g, "");
  const upper = text.replace(/[^A-Z]/g, "");
  if (letters.length > 30 && upper.length / letters.length > 0.5) signals.push("excessive_caps");
  if ((text.match(/!/g) || []).length >= 3) signals.push("many_exclamations");
  if (/\b(kindly|do the needful|revert back)\b/i.test(text)) signals.push("formulaic_phrasing");
  if (/(.)\1{4,}/.test(text)) signals.push("repeated_characters");
  return signals;
}

const PROMO = [/\b(sale|offer|discount|% off|flat \d+|coupon|deal|shop now|limited stock|new arrivals|subscribe|unsubscribe|t&c apply|opt[- ]out|stop to \d+)\b/i];

export function sanitizeMessage(input) {
  if (typeof input !== "string") return { ok: false, error: "invalid_type" };
  // Strip control characters (keep newlines/tabs) and normalise whitespace.
  const cleaned = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
  if (!cleaned) return { ok: false, error: "empty" };
  if (cleaned.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too_long" };
  return { ok: true, text: cleaned };
}

/**
 * Analyse a message. Returns a plain JSON-serialisable result.
 * @param {string} rawText
 * @param {{ classifier?: (text: string) => { label: string, probability: number } }} [options]
 */
export function analyzeMessage(rawText, options = {}) {
  const sanitized = sanitizeMessage(rawText);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };
  const text = sanitized.text;
  const protective = has(text, PROTECTIVE);

  const indicators = [];
  let score = 0;
  let sensitiveRequest = false;
  for (const rule of RULES) {
    if (!has(text, rule.patterns)) continue;
    if (rule.when && !rule.when(text)) continue;
    // Genuine banks write "never share your OTP" — do not punish protective advice.
    if ((rule.id === "otp_request" || rule.id === "credential_request" || rule.id === "upi_pin_request") && protective && !has(text, [/\b(reply|call|whatsapp)\b[^.\n]{0,30}\b(otp|pin|code)\b/i])) continue;
    indicators.push({ id: rule.id, weight: rule.weight, phrases: matches(text, rule.patterns).slice(0, 4) });
    score += rule.weight;
    if (rule.sensitive) sensitiveRequest = true;
  }

  const urls = extractUrls(text).map(inspectUrl);
  const riskyUrls = urls.filter((u) => u.risk === "high" || u.risk === "medium");
  if (riskyUrls.length) {
    const w = riskyUrls.some((u) => u.risk === "high") ? 22 : 12;
    indicators.push({ id: "suspicious_url", weight: w, phrases: riskyUrls.map((u) => u.url).slice(0, 4) });
    score += w;
  } else if (urls.some((u) => u.risk === "unverified") && score >= 20) {
    // An ordinary link only matters when combined with other warning signs.
    indicators.push({ id: "link_with_pressure", weight: 8, phrases: urls.map((u) => u.url).slice(0, 3) });
    score += 8;
  }

  const grammar = grammarSignals(text);
  if (grammar.length && score > 0) {
    const w = Math.min(8, grammar.length * 4);
    indicators.push({ id: "writing_style", weight: w, phrases: grammar });
    score += w;
  }

  // Combination bonuses: prize/job/investment + payment or credential request.
  const ids = new Set(indicators.map((i) => i.id));
  if (sensitiveRequest && (ids.has("urgency") || ids.has("threat_language") || ids.has("suspicious_url"))) score += 10;
  if ((ids.has("lottery_prize") || ids.has("fake_job") || ids.has("investment_promise")) && (ids.has("unusual_payment") || sensitiveRequest)) score += 10;

  score = Math.min(100, score);
  const promotional = has(text, PROMO);

  let level = "low";
  if (score >= 60) level = "critical";
  else if (score >= 35) level = "high";
  else if (score >= 15) level = "medium";

  let classification = "likely_safe";
  if (score >= 70 && sensitiveRequest) classification = "high_risk_fraud";
  else if (score >= 35) classification = "potential_scam";
  else if (score >= 15 && promotional && !sensitiveRequest) classification = "potential_spam";
  else if (score >= 15) classification = "suspicious";
  else if (promotional && urls.length) classification = "potential_spam";

  let model = null;
  if (typeof options.classifier === "function") {
    try { model = options.classifier(text); } catch { model = null; }
  }

  return {
    ok: true,
    engine: "rule-based-v1",
    classification,
    level,
    score,
    indicators,
    urls,
    protectiveLanguage: protective,
    characters: text.length,
    model, // only populated when a real trained classifier is supplied
  };
}
