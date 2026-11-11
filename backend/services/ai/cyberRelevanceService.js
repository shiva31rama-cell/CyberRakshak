const GREETING_PATTERN = /^(hi|hello|hey|hiya|good morning|good afternoon|good evening|how are you|how r u|what'?s up|who are you|what can you do|what do you do|help)$/i;
const CYBER_PATTERN = /cyber|hack|hacked|hacking|security|secure|scam|fraud|phish|suspicious|malware|virus|spyware|ransomware|otp|upi|payment|transaction|bank|password|passcode|mfa|2fa|account|login|sign.?in|email|phone|mobile|device|laptop|computer|wifi|privacy|data leak|breach|stolen|identity|impersonat|fake|online|internet|website|link|url|attachment|social engineering|cyberbully|threat|blackmail|report|1930|cybercrime|digital arrest/i;

function classify(text) {
  const value = String(text || "").trim();
  const isGreeting = GREETING_PATTERN.test(value);
  const isCyberRelated = isGreeting || CYBER_PATTERN.test(value);
  return {
    isGreeting,
    isCyberRelated,
    intent: isGreeting ? "greeting" : isCyberRelated ? "cyber_assistance" : "non_cyber",
  };
}

module.exports = { classify, GREETING_PATTERN };
