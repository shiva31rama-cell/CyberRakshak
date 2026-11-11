const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync } = require("node:crypto");

const pair = generateKeyPairSync("ed25519");
process.env.NOTICE_SIGNING_PRIVATE_KEY = pair.privateKey.export({ type: "pkcs8", format: "pem" });
process.env.NOTICE_SIGNING_PUBLIC_KEY = pair.publicKey.export({ type: "spki", format: "pem" });

const { verifyPublicNotice } = require("../services/trust/noticeService");
const { verifyNotice } = require("../services/trust/noticeCryptoService");

test("notice verifier rejects non-existent references without exposing details", async () => {
  await assert.rejects(() => verifyPublicNotice("not-a-real-reference"), /Published notice not found/);
});

test("notice verifier does not treat a published record as current when signature is invalid", async () => {
  const notice = {
    noticeId: "synthetic",
    version: 1,
    category: "general",
    title: "Test",
    body: "Synthetic body",
    organizationId: "64a000000000000000000001",
    issuerMemberId: "64a000000000000000000002",
    issuedAt: new Date(),
    expiresAt: null,
    status: "published",
    contentDigest: "bad",
    signature: "bad",
    keyId: "cyberrakshak-demo-key-v1",
    signatureAlgorithm: "Ed25519",
  };
  assert.equal(verifyNotice(notice), false);
});
