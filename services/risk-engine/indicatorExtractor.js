const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/gi;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)/g;
const UPI_PATTERN = /\b[A-Z0-9._-]{2,}@[A-Z0-9.-]{2,}\b/gi;

const unique = (values) => [...new Set(values)];

const extractIndicators = (input) => {
  const text = String(input ?? "").slice(0, 12000);
  const indicators = [];

  for (const value of unique(text.match(URL_PATTERN) || [])) {
    indicators.push({ type: "url", value });
  }

  for (const value of unique(text.match(EMAIL_PATTERN) || [])) {
    indicators.push({ type: "email", value: value.toLowerCase() });
  }

  for (const value of unique(text.match(PHONE_PATTERN) || [])) {
    indicators.push({ type: "phone", value: value.replace(/[\s-]/g, "") });
  }

  for (const value of unique(text.match(UPI_PATTERN) || [])) {
    if (value.includes("@") && !value.includes(".")) {
      indicators.push({ type: "upi", value: value.toLowerCase() });
    }
  }

  return indicators;
};

module.exports = { extractIndicators };
