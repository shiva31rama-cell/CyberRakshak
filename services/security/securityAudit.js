const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
  /(?:api[_-]?key|secret|password|token)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}["']?/gi,
  /VITE_[A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD)/g,
];

const scanTextForSecrets = (text, fileName = "") => {
  const findings = [];
  const value = String(text ?? "");
  for (const pattern of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    const matches = value.match(pattern) || [];
    if (matches.length) {
      findings.push({
        file: fileName,
        type: pattern.source.includes("PRIVATE KEY") ? "private-key" : pattern.source.includes("VITE_") ? "frontend-secret-name" : "secret-like-value",
        count: matches.length,
      });
    }
  }
  return findings;
};

const auditFiles = (files = []) => files.flatMap((file) => scanTextForSecrets(file.content, file.path));

module.exports = { scanTextForSecrets, auditFiles, SECRET_PATTERNS };
