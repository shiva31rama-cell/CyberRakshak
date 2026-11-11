const { createPrivateKey, createPublicKey, generateKeyPairSync, sign, verify, createHash } = require("node:crypto");

const KEY_ID = process.env.NOTICE_SIGNING_KEY_ID || "cyberrakshak-demo-key-v1";
const publicKeyRegistry = new Map();

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function readPem(value) {
  return typeof value === "string" ? value.replace(/\\n/g, "\n") : value;
}

function getSignedFields(notice) {
  return {
    schemaVersion: 1,
    noticeId: notice.noticeId,
    organizationId: String(notice.organizationId),
    version: Number(notice.version),
    category: notice.category,
    title: notice.title,
    body: notice.body,
    issuerMemberId: String(notice.issuerMemberId),
    issuedAt: notice.issuedAt ? new Date(notice.issuedAt).toISOString() : null,
    expiresAt: notice.expiresAt ? new Date(notice.expiresAt).toISOString() : null,
  };
}

function getPrivateKey() {
  const pem = process.env.NOTICE_SIGNING_PRIVATE_KEY;
  if (!pem) throw Object.assign(new Error("Notice signing is not configured"), { status: 503 });
  return createPrivateKey(readPem(pem));
}

function registerPublicKey(keyId, publicKeyPem) {
  if (!keyId || typeof keyId !== "string" || !publicKeyPem) {
    throw new TypeError("A key ID and PEM public key are required");
  }
  publicKeyRegistry.set(keyId, createPublicKey(readPem(publicKeyPem)));
}

function getPublicKey(keyId) {
  if (publicKeyRegistry.has(keyId)) return publicKeyRegistry.get(keyId);
  if (keyId === KEY_ID && process.env.NOTICE_SIGNING_PUBLIC_KEY) {
    registerPublicKey(keyId, process.env.NOTICE_SIGNING_PUBLIC_KEY);
    return publicKeyRegistry.get(keyId);
  }
  throw Object.assign(new Error("Notice verification key is unavailable"), { status: 503 });
}

function createDevelopmentKeyPair() {
  const pair = generateKeyPairSync("ed25519");
  return {
    privateKey: pair.privateKey.export({ type: "pkcs8", format: "pem" }),
    publicKey: pair.publicKey.export({ type: "spki", format: "pem" }),
  };
}

function signNotice(notice) {
  const payload = canonicalize(getSignedFields(notice));
  const digest = createHash("sha256").update(payload, "utf8").digest("hex");
  const envelope = canonicalize({
    keyId: KEY_ID,
    signatureAlgorithm: "Ed25519",
    contentDigest: digest,
    payload,
  });
  const privateKey = getPrivateKey();
  const signature = sign(null, Buffer.from(envelope, "utf8"), privateKey).toString("base64");
  const publicKeyPem = createPublicKey(privateKey).export({ type: "spki", format: "pem" });
  registerPublicKey(KEY_ID, publicKeyPem);
  return { contentDigest: digest, signature, keyId: KEY_ID, signatureAlgorithm: "Ed25519" };
}

function verifyNotice(notice) {
  if (!notice?.contentDigest || !notice?.signature || !notice?.keyId || notice.signatureAlgorithm !== "Ed25519") {
    return false;
  }
  const payload = canonicalize(getSignedFields(notice));
  const digest = createHash("sha256").update(payload, "utf8").digest("hex");
  if (digest !== notice.contentDigest) return false;
  const envelope = canonicalize({
    keyId: notice.keyId,
    signatureAlgorithm: notice.signatureAlgorithm,
    contentDigest: digest,
    payload,
  });
  try {
    return verify(null, Buffer.from(envelope, "utf8"), getPublicKey(notice.keyId), Buffer.from(notice.signature, "base64"));
  } catch {
    return false;
  }
}

module.exports = { canonicalize, getSignedFields, signNotice, verifyNotice, createDevelopmentKeyPair, registerPublicKey, KEY_ID };
