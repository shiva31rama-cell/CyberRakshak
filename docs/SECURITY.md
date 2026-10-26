# CyberRakshak Security and Privacy

## Current controls

- Helmet security headers
- Environment-based CORS origin
- JSON/form request size limits
- Authentication rate limiting
- Chat rate limiting
- Scanner rate limiting
- JWT/bcrypt authentication foundation
- Backend-only AI credentials
- Pattern-based secret detection that keeps detected chat conversations on the application fallback instead of forwarding them to the configured AI provider
- Fail-safe AI provider fallback
- Centralized Express error response
- Explicit trusted-proxy configuration and rate limits for public report/feedback writes

## Sensitive information

CyberRakshak must never ask users to submit:

- OTPs
- UPI PINs
- card PINs
- CVVs/CVCs
- passwords
- recovery codes
- API keys
- authentication tokens

Technical logs should not contain these values or raw sensitive incident details. Secret detection is pattern-based and cannot guarantee detection of every secret, so the interface must continue warning users not to submit any authentication secret.

## Report storage and case lookup

Scam reports are stored in MongoDB with the reporter's name, email, optional phone, scam type, description, suspect details, and amount lost. Authorized administrators and an authenticated report owner can retrieve a full report. The public case-number lookup returns only the case reference, status, and submission date. Newly created case references use random 128-bit values.

Submitting a report in CyberRakshak does not send it to police, a bank, or a government agency. Anyone with the random case reference can see the limited status and request deletion of the active record; the interface warns users to keep the reference private. This does not guarantee immediate deletion from database backups. Automatic retention periods and backup deletion behavior still need an approved policy and hosting configuration before production.

## Environment variables

`.env` files are ignored by Git and `.env.example` files contain placeholders only. AI keys must never be placed in Vite frontend environment variables.

## URL analysis and offline cache

The URL scanner performs local structural analysis on the submitted URL on the CyberRakshak backend. It does not fetch the destination and does not currently perform live reputation checks. URL indicators are clues to investigate, not proof of maliciousness. A clean structural result is not a safety guarantee.

The frontend service worker caches only the same-origin app shell and static assets. It bypasses `/api` requests entirely; chat requests, scans, and other dynamic API responses are not cached. First-time offline use is not guaranteed until an online visit has successfully cached the necessary shell and assets. API-backed features remain unavailable without connectivity.

## File uploads

Screenshot/image analysis is not represented as implemented yet. Before enabling it, the backend must enforce MIME validation, extension checks, size limits, processing timeouts and temporary-storage cleanup.

## Risk communication

Risk levels describe observable indicators and should not be presented as legal or forensic confirmation. The product must distinguish suspicious, potentially fraudulent and confirmed information when evidence supports the distinction.

## Future review items

- Secure token-storage strategy documentation
- Consent, access, retention and deletion controls before any future analysis-history persistence
- URL-scanner threat-intelligence verification
- Image-processing isolation
- Dependency vulnerability review
- Production CORS origin verification
- Audit logging without sensitive payloads
