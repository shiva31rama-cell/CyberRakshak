const SECRET_PATTERNS = [
  /(?:otp|one[- ]time password)\s*[:=]\s*\S+/i,
  /(?:upi pin|pin|cvv|cvc|password|passcode|recovery code|api key)\s*[:=]\s*\S+/i,
];

function containsSensitiveSecret(text) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(String(text || "")));
}

function safetyInstruction(text) {
  if (!containsSensitiveSecret(text)) return "";
  return "The user may have included a secret. Never repeat, store, or expose it. Tell the user not to share OTPs, passwords, PINs, CVVs, recovery codes or API keys and continue with safe guidance.";
}

module.exports = { containsSensitiveSecret, safetyInstruction };
