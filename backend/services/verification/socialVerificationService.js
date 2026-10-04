const OFFICIAL_SOURCES = [
  { name: "National Cyber Crime Reporting Portal", domain: "cybercrime.gov.in", tier: 1 },
  { name: "CERT-In", domain: "cert-in.org.in", tier: 1 },
  { name: "Government of India", domain: "gov.in", tier: 1 },
  { name: "Reserve Bank of India", domain: "rbi.org.in", tier: 1 },
];

function extractClaim(input) {
  const value = String(input || "").trim();
  if (!value) throw Object.assign(new Error("Claim is required"), { status: 400 });
  if (value.length > 3000) throw Object.assign(new Error("Claim is too long"), { status: 400 });
  return value;
}

function verifySocialClaim(input) {
  const claim = extractClaim(input);
  const lower = claim.toLowerCase();
  const officialMention = OFFICIAL_SOURCES.find((source) => lower.includes(source.domain) || lower.includes(source.name.toLowerCase()));
  const unsupportedAbsolute = /100%|guaranteed|officially confirmed|government confirmed/i.test(claim);
  const scamSignals = /otp|upi|bank|payment|prize|lottery|investment|job|refund|account blocked|cybercrime/i.test(lower);

  let verdict = "Unverified";
  let explanation = "CyberRakshak could not independently verify this claim from the supplied text alone. Unverified does not mean false.";
  if (officialMention && !unsupportedAbsolute) {
    verdict = "Needs source check";
    explanation = "The claim mentions an official source, but mentioning a domain or organization is not proof that the claim itself is genuine. Open the official source independently and compare the exact announcement.";
  } else if (unsupportedAbsolute || scamSignals) {
    verdict = "Needs verification";
    explanation = "The claim contains pressure, financial/security language, or an absolute assertion that should be checked against an independent official or reliable source before being trusted or shared.";
  }

  return {
    claim,
    verdict,
    explanation,
    evidence: [],
    officialSources: OFFICIAL_SOURCES,
    nextSteps: [
      "Check the original post/video date and exact wording.",
      "Open the relevant official website independently rather than using a link in the post.",
      "Compare the claim with at least one authoritative source before sharing or acting.",
    ],
    limitation: "This version performs structured claim triage only. It does not browse social platforms or claim real-time verification without evidence.",
  };
}

module.exports = { verifySocialClaim, OFFICIAL_SOURCES };
