const test = require("node:test");
const assert = require("node:assert/strict");
const { validateChatResponse } = require("../services/ai/chatResponseContract");

const validResponse = () => ({
  success: true,
  reply: "Use the bank's official app and do not share an OTP.",
  provider: "AI",
  intent: "cyber_assistance",
  incidentType: "financial_fraud",
  triageStage: "contain",
  sources: [
    { label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" },
  ],
});

test("accepts a valid structured chat response and normalizes reply whitespace", () => {
  const result = validateChatResponse({ ...validResponse(), reply: "  Keep your account secure.  " });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.data.reply, "Keep your account secure.");
  assert.equal(result.data.sources.length, 1);
});

test("rejects a missing, blank, non-string or oversized reply", () => {
  for (const reply of [undefined, null, "", "   ", 42, "x".repeat(8001)]) {
    const result = validateChatResponse({ ...validResponse(), reply });
    assert.equal(result.valid, false, `should reject reply: ${String(reply).slice(0, 20)}`);
    assert.ok(result.errors.some((error) => /reply/.test(error)));
  }
});

test("rejects unsupported provider, intent, incident type and triage stage", () => {
  const invalidCases = [
    { provider: "provider-invented" },
    { intent: "general_chat" },
    { incidentType: "credential_theft" },
    { triageStage: "completed_successfully" },
  ];

  for (const change of invalidCases) {
    const result = validateChatResponse({ ...validResponse(), ...change });
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  }
});

test("rejects arbitrary source objects and non-HTTPS or credential-bearing URLs", () => {
  const invalidSources = [
    [{ label: "Official", url: "http://cybercrime.gov.in/" }],
    [{ label: "Official", url: "https://user:secret@cybercrime.gov.in/" }],
    [{ label: "", url: "https://cybercrime.gov.in/" }],
    [{ label: "Official", url: "javascript:alert(1)" }],
    [{ label: "Official", url: "not-a-url" }],
    [{ label: "Official" }],
  ];

  for (const sources of invalidSources) {
    assert.equal(validateChatResponse({ ...validResponse(), sources }).valid, false);
  }
});

test("rejects too many sources and non-object payloads", () => {
  assert.equal(validateChatResponse({ ...validResponse(), sources: Array.from({ length: 11 }, (_, i) => ({ label: String(i), url: "https://example.org/" })) }).valid, false);
  assert.equal(validateChatResponse(null).valid, false);
  assert.equal(validateChatResponse([]).valid, false);
});

test("accepts an explicit no-incident state and empty source list", () => {
  const result = validateChatResponse({
    ...validResponse(),
    provider: "CyberRakshak scope guard",
    intent: "non_cyber",
    incidentType: null,
    triageStage: "general",
    sources: [],
  });
  assert.equal(result.valid, true);
  assert.equal(result.data.incidentType, null);
  assert.deepEqual(result.data.sources, []);
});
