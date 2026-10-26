const SECRET_PATTERNS = [
  /\b(?:otp|one[- ]time (?:password|code))\b\s*(?:is|:|=)\s*\S+/i,
  /\b(?:upi pin|pin|cvv|cvc|password|passcode|recovery code|api key)\b\s*(?:is|:|=)\s*\S+/i,
];

function containsSensitiveSecret(text) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(String(text || "")));
}

module.exports = { containsSensitiveSecret };
