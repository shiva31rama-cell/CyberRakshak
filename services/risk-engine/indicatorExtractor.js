const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)/g;
const UPI_PATTERN = /\b[a-z0-9][a-z0-9._-]{1,63}@[a-z][a-z0-9.-]{1,63}\b/gi;
const DOMAIN_PATTERN = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\b/gi;
const SHA256_PATTERN = /\b[a-f0-9]{64}\b/gi;
const SHA1_PATTERN = /\b[a-f0-9]{40}\b/gi;
const MD5_PATTERN = /\b[a-f0-9]{32}\b/gi;

const unique = (values) => [...new Set(values)];

const stripTrailingPunctuation = (value) => value.replace(/[),.;!?]+$/g, "");

const extractIndicators = (input) => {
  const text = String(input ?? "").slice(0, 12000);
  const indicators = [];
  const urls = unique((text.match(URL_PATTERN) || []).map(stripTrailingPunctuation));
  const emails = unique((text.match(EMAIL_PATTERN) || []).map((value) => value.toLowerCase()));
  const phones = unique(
    (text.match(PHONE_PATTERN) || []).map((value) => value.replace(/[\s-]/g, "")),
  );
  const upis = unique((text.match(UPI_PATTERN) || [])
    .map((value) => value.toLowerCase())
    .filter((value) => !emails.includes(value)));
  const hashes = unique([
    ...(text.match(SHA256_PATTERN) || []).map((value) => ({ type: "sha256", value })),
    ...(text.match(SHA1_PATTERN) || []).map((value) => ({ type: "sha1", value })),
    ...(text.match(MD5_PATTERN) || []).map((value) => ({ type: "md5", value })),
  ]);

  for (const value of urls) indicators.push({ type: "url", value });
  for (const value of emails) indicators.push({ type: "email", value });
  for (const value of phones) indicators.push({ type: "phone", value });
  for (const value of upis) indicators.push({ type: "upi", value });
  for (const hash of hashes) indicators.push({
    type: "hash",
    value: hash.value,
    algorithm: hash.type,
  });

  const urlDomains = urls.map((url) => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return null;
    }
  });

  const standaloneDomains = unique(text.match(DOMAIN_PATTERN) || [])
    .map((value) => value.toLowerCase())
    .filter((domain) => !emails.some((email) => email.endsWith(`@${domain}`)));

  for (const domain of unique([...urlDomains, ...standaloneDomains].filter(Boolean))) {
    indicators.push({ type: "domain", value: domain });
  }

  return indicators;
};

module.exports = { extractIndicators };
