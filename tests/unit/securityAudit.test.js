const test = require("node:test");
const assert = require("node:assert/strict");
const { scanTextForSecrets, auditFiles } = require("../../services/security/securityAudit");

test("detects OpenAI-style project keys", () => {
  const findings = scanTextForSecrets("const key = 'sk-proj-abcdefghijklmnopqrstuvwxyz123456';", "test.js");
  assert.equal(findings.length > 0, true);
});

test("detects private keys", () => {
  const findings = scanTextForSecrets("-----BEGIN PRIVATE KEY-----\nsecret\n-----END PRIVATE KEY-----", "key.txt");
  assert.equal(findings.some((item) => item.type === "private-key"), true);
});

test("detects frontend secret variable names", () => {
  const findings = scanTextForSecrets("const VITE_OPENAI_API_KEY = 'x';", "config.js");
  assert.equal(findings.some((item) => item.type === "frontend-secret-name"), true);
});

test("audits multiple files", () => {
  const findings = auditFiles([
    { path: "safe.js", content: "const x = 1;" },
    { path: "bad.js", content: "password = 'abcdefghijklmnop';" },
  ]);
  assert.equal(findings.length > 0, true);
});
