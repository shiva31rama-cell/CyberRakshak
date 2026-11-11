const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync } = require("node:crypto");

const pair = generateKeyPairSync("ed25519");
process.env.NOTICE_SIGNING_PRIVATE_KEY = pair.privateKey.export({ type: "pkcs8", format: "pem" });
process.env.NOTICE_SIGNING_PUBLIC_KEY = pair.publicKey.export({ type: "spki", format: "pem" });

const { signNotice, verifyNotice, canonicalize } = require("../services/trust/noticeCryptoService");

const notice = () => ({
  noticeId: "test-notice-001",
  organizationId: "64a000000000000000000001",
  version: 1,
  category: "placement",
  title: "Campus placement drive",
  body: "Synthetic test notice. No real organisation or payment details.",
  issuerMemberId: "64a000000000000000000002",
  issuedAt: new Date("2026-11-11T08:00:00.000Z"),
  expiresAt: new Date("2026-12-11T08:00:00.000Z"),
});

test("canonical JSON sorts object keys consistently", () => {
  assert.equal(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
});

test("Ed25519 signature verifies for the original notice", () => {
  const item = notice();
  Object.assign(item, signNotice(item));
  assert.equal(verifyNotice(item), true);
});

test("Ed25519 signature fails after a signed field is modified", () => {
  const item = notice();
  Object.assign(item, signNotice(item));
  item.body = "Modified payment destination.";
  assert.equal(verifyNotice(item), false);
});

test("Ed25519 signature fails if the signature is modified", () => {
  const item = notice();
  Object.assign(item, signNotice(item));
  item.signature = Buffer.from("invalid").toString("base64");
  assert.equal(verifyNotice(item), false);
});
