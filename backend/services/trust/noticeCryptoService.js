const {
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  sign,
  verify,
  createHash,
} = require("node:crypto");

const KEY_ID = process.env.NOTICE_SIGNING_KEY_ID || "cyberrakshak-demo-key-v1";
const publicKeyRegistry = new Map();

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
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
  if (!pem) {
    const error = new Error("Notice signing is not configured");
    error.status = 503;
    throw error;
  }
  return createPrivateKey(pem.replace(/\\n/g, "\n"));
}

function getPublicKey(keyId = KEY_ID) {
  const registered = publicKeyRegistry.get(keyId);
  if (registered) return registered;
  const pem = process.env.NOTICE_SIGNING_PUBLIC_KEY;
  if (!pem) {
    const error = new Error("Notice verification public key is not configured");
    error.status = 503;
    throw error;
  }
  return createPublicKey(pem.replace(/\\n/g, "\n"));
}

function registerPublicKey(keyId, publicKeyPem) {
  if (!keyId || typeof keyId !== "string" || !publicKeyPem) {
    throw new TypeError("A key ID and PEM public key are required");
  }
  publicKeyRegistry.set(keyId, createPublicKey(publicKeyPem));
}

function getPublicKeyFromPrivate() {
  return createPublicKey(getPrivateKey());
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
  const signature = sign(null, Buffer.from(envelope, "utf8"), getPrivateKey()).toString("base64");
  registerPublicKey(KEY_ID, getPublicKeyFromPrivate());
  return { contentDigest: digest, signature, keyId: KEY_ID, signatureAlgorithm: "Ed25519" };
}

function verifyNotice(notice) {
  if (!notice?.contentDigest || !notice?.signature || !notice?.keyId || !notice?.signatureAlgorithm) return false;
  if (notice.signatureAlgorithm !== "Ed25519") return false;
  const payload = canonicalize(getSignedFields(notice));
  const digest = createHash("sha256").update(payload, "utf8").digest("hex");
  if (digest !== notice.contentDigest) return false;
  const envelope = canonicalize({
    keyId: notice.keyId,
    signatureAlgorithm: notice.signatureAlgorithm,
    contentDigest: notice.contentDigest,
    payload,
  });
  try {
    return verify(null, Buffer.from(envelope, "utf8"), getPublicKey(notice.keyId), Buffer.from(notice.signature, "base64"));
  } catch {
    return false;
  }
}

module.exports = { canonicalize, getSignedFields, signNotice, verifyNotice, createDevelopmentKeyPair, registerPublicKey, KEY_ID };
