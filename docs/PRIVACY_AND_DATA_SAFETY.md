# Privacy & Data Safety Baseline

CyberRakshak handles potentially sensitive cyber-safety material, so privacy is a product requirement rather than an afterthought.

## Data minimization

- Do not collect passwords, OTPs, PINs, CVVs, private keys or authentication tokens.
- Prefer self-declared language and age-group preferences; do not require biometrics for personalization.
- Accept only the minimum message/URL context needed for analysis.
- Avoid storing raw scam content when a derived risk result is sufficient.

## Analysis safety

- Treat submitted URLs and message text as untrusted input.
- Never execute downloaded web content as part of ordinary analysis.
- Do not automatically visit suspicious URLs merely to classify them.
- Keep third-party datasets and threat feeds behind provenance, license and safety checks.

## API protection

- Apply input-size limits and rate limits.
- Validate content types and schemas at API boundaries.
- Never expose server-side secrets in frontend bundles.
- Log security events without logging secrets or unnecessary message contents.
- Use generic authentication errors and secure session handling.

## Retention

Any stored scam report, attachment or feedback record should have a documented purpose, retention period and deletion process. Production deployments must define these policies before enabling long-term storage.

## AI safety

AI-generated explanations must not be presented as authoritative investigation results. The UI should communicate uncertainty and fall back to deterministic rules when an AI service is unavailable or untrusted.
