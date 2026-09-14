const test = require("node:test");
const assert = require("node:assert/strict");
const { scanTextForSecrets, auditFiles } = require("../../services/security/securityAudit");

const fakeOpenAiKey = ["sk", "proj", "abcdefghijklmnopqrstuvwxyz123456"].join("-");

test("detects OpenAI-style project keys", () => {
  const findings = scanTextForSecrets(`const key = '${fakeOpenAiKey}';`, "test.js");
  assert.equal(findings.length > 0, true);
});

test("detects private keys", () => {
  const marker = ["BEGIN", "PRIVATE KEY"].join(" ");
  const findings = scanTextForSecrets(`-----${marker}-----\nsecret\n-----END PRIVATE KEY-----`, "key.txt");
  assert.equal(findings.some((item) => item.type === "private-key"), true);
});

test("detects frontend secret variable names", () => {
  const variableName = ["VITE", "OPENAI_API_KEY"].join("_");
  const findings = scanTextForSecrets(`const ${variableName} = 'x';`, "config.js");
  assert.equal(findings.some((item) => item.type === "frontend-secret-name"), true);
});

test("audits multiple files", () => {
  const credential = ["password", "abcdefghijklmnop"].join(" = '") + "';";
  const findings = auditFiles([
    { path: "safe.js", content: "const x = 1;" },
    { path: "bad.js", content: credential },
  ]);
  assert.equal(findings.length > 0, true);
});
