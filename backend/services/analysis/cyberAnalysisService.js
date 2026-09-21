const CATEGORY_RULES = [
  { category: "phishing", patterns: [/verify.*account/i, /kyc/i, /login.*link/i, /click.*link/i, /suspicious link/i, /account.*blocked/i, /urgent.*verify/i] },
  { category: "otp_scam", patterns: [/otp/i, /one[- ]time password/i, /share.*code/i, /verification code/i] },
  { category: "upi_fraud", patterns: [/upi/i, /collect request/i, /scan.*qr/i, /upi pin/i, /payment request/i] },
  { category: "banking_fraud", patterns: [/bank account/i, /debit card/i, /credit card/i, /bank.*blocked/i, /transaction.*not mine/i] },
  { category: "fake_job_scam", patterns: [/job offer/i, /work from home/i, /registration fee/i, /job.*fee/i, /recruitment.*payment/i] },
  { category: "investment_scam", patterns: [/guaranteed returns/i, /double.*money/i, /investment.*profit/i, /crypto.*profit/i] },
  { category: "lottery_scam", patterns: [/won.*prize/i, /lottery/i, /lucky winner/i, /claim.*reward/i] },
  { category: "fake_customer_care", patterns: [/customer care/i, /support number/i, /helpline number/i, /refund.*call/i] },
  { category: "delivery_scam", patterns: [/delivery/i, /courier/i, /parcel/i, /shipping.*fee/i] },
  { category: "impersonation", patterns: [/pretend.*bank/i, /pretending.*bank/i, /impersonat/i, /fake.*profile/i, /official.*representative/i] },
];

function analyzeMessage(input) {
  const text = String(input || "").trim();
  if (!text) throw Object.assign(new Error("Message is required"), { status: 400 });
  if (text.length > 5000) throw Object.assign(new Error("Message is too long"), { status: 400 });

  const indicators = [];
  const add = (value) => { if (!indicators.includes(value)) indicators.push(value); };

  if (/https?:\/\/|www\.|bit\.ly|tinyurl|\.com\//i.test(text)) add("Contains a link or URL");
  if (/urgent|immediately|within \d+ (minutes?|hours?)|today|last chance|account.*blocked/i.test(text)) add("Urgency or pressure");
  if (/otp|one[- ]time password|upi pin|cvv|password|passcode|verification code/i.test(text)) add("Requests or mentions authentication information");
  if (/pay|payment|fee|send money|transfer|deposit|₹|rs\.?\s?\d+/i.test(text)) add("Requests money or payment");
  if (/won|winner|prize|reward|cashback|refund/i.test(text)) add("Unexpected reward, prize or refund claim");
  if (/kyc|verify.*account|update.*account|suspend|blocked/i.test(text)) add("Account verification or suspension pressure");

  const matched = CATEGORY_RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(text)));
  const category = matched?.category || (indicators.length ? "suspicious_message" : "general_cyber_awareness");

  let riskLevel = "LOW";
  if (indicators.length >= 3) riskLevel = "HIGH";
  else if (indicators.length >= 1) riskLevel = "MEDIUM";
  if (/shared.*otp|shared.*password|sent.*pin|money.*lost|unauthorized.*transaction|clicked.*link.*entered/i.test(text)) riskLevel = "HIGH";

  const isCyberRelated = category !== "general_cyber_awareness" || indicators.length > 0 || /cyber|security|scam|fraud|phish|malware|password|otp|upi|privacy|hack|suspicious|online safety/i.test(text);
  const recommendedActions = [
    "Do not click suspicious links or open unexpected attachments.",
    "Do not share OTPs, passwords, PINs, CVVs or recovery codes.",
    "Verify the request using the organisation's official website or app.",
  ];

  if (/money|payment|transaction|upi|bank/i.test(text)) recommendedActions.unshift("If an unauthorized payment occurred, contact your bank or payment provider immediately.");

  return {
    isCyberRelated,
    category,
    riskLevel,
    confidence: indicators.length ? Math.min(0.98, 0.55 + indicators.length * 0.1) : 0.45,
    indicators,
    explanation: indicators.length
      ? "The message contains observable warning signs that can be associated with cyber scams or unsafe requests. These indicators are not, by themselves, proof of fraud."
      : "No strong scam indicators were detected by the current heuristic checks.",
    recommendedActions: [...new Set(recommendedActions)].slice(0, 5),
    shouldReport: ["phishing", "lottery_scam", "upi_fraud", "banking_fraud", "fake_job_scam", "investment_scam"].includes(category),
    language: "en",
    sources: [],
    analysisMethod: "CyberRakshak heuristic analysis",
  };
}

module.exports = { analyzeMessage };
