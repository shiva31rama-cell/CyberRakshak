# CyberRakshak 3.0 — Campus TrustDesk Product Specification

**Status:** Proposed MVP specification  
**Research cut-off:** 11 November 2026  
**Implementation branch:** `feat/campus-trustdesk-mvp`

## Product statement

Verify official campus communications, reduce payment-instruction deception, and coordinate multilingual cyber-incident response.

Campus TrustDesk is a campus-focused workflow extension to CyberRakshak. It is not a bank, police service, government authority, or definitive fraud-detection service.

## Primary user journey

1. A verified campus issuer creates a notice.
2. An authorised approver reviews it; sensitive notice categories require a second, distinct approver.
3. On publish, the server canonicalises the notice fields, computes a SHA-256 content digest, and signs a version-bound payload with Ed25519.
4. A public verification page exposes the canonical published record, issuer, version, validity window and current state.
5. Recipients compare the forwarded notice with the authoritative record. The verification response does not prove who sent the forwarded content.
6. A suspicious event can be reported to an authorised campus responder with explicit user consent.

## Core MVP boundaries

### Included
- Organisation profile and verified status.
- Organisation membership and explicit roles.
- Versioned campus notices with draft, pending approval, published, superseded, revoked and expired states.
- Two-person approval for sensitive categories; requester cannot approve their own request.
- Server-side Ed25519 signing and public-key verification metadata.
- Public verification by opaque reference ID.
- Audit events for all sensitive state transitions.
- Message/URL analysis remains a supporting capability.
- A browser QR code may encode the public verification URL; QR scanning is a later frontend slice.

### Not included
- Bank or UPI connectivity, payment execution or transaction monitoring.
- Automatic government complaint submission.
- Claims that an issuer's WhatsApp account or sender is genuine.
- Blockchain, public ledgers, autonomous AI actions or full threat-intelligence infrastructure.
- Multi-campus SaaS billing in the first college pilot.

## Notice integrity design

- Canonical payload fields: notice ID, organisation ID, version, category, title, body, issuer member ID, issue time, expiry time and digest algorithm.
- Canonical JSON must use deterministic property ordering and UTF-8 encoding.
- SHA-256 digest is calculated over canonical content, excluding mutable workflow state.
- Ed25519 signature covers a canonical signed envelope including key ID, version and digest.
- Private signing keys are only supplied via backend secret storage. No private key may be committed to Git, stored in MongoDB, or returned by an API.
- Store key ID and public key metadata so verification can survive key rotation.
- A published version is immutable. Edits create a new version.
- Revocation/supersession changes current status and creates an audit event. Old signatures remain verifiable as signatures over old payloads, but the public verifier must show the current status.
- Unknown, invalid, expired, revoked and superseded are separate outcomes.
- A QR is a locator, not an authenticity guarantee. Public verification displays the complete authoritative notice so the person can compare context and fields.

## Initial roles

- `platform_admin`: platform-level operations; not automatically a campus issuer.
- `organization_admin`: manages one organisation's membership and configuration.
- `issuer`: creates and submits notices.
- `approver`: approves sensitive notices; must differ from issuer.
- `student` / `staff`: may read public notices and use verification features.
- `incident_responder`: later phase for consent-based cases.

Existing legacy `User.role` values are `user` and `admin`. Do not silently reinterpret these as trusted organisation roles. Campus membership must be a separate server-verified relationship.

## Tenant isolation

Every private campus record is scoped by `organizationId`. Protected APIs derive organisation and roles from authenticated user membership records, never from client-supplied role or tenant values. Public endpoints return only explicitly published notice data. Add cross-tenant tests for read, update, approve and revoke attempts.

## Security and privacy

- No passwords, OTPs, PINs, CVVs, recovery codes or authentication tokens in notice content or incident forms.
- Enforce body limits, content validation, rate limits and strict role checks.
- No arbitrary URL fetching from the backend.
- Raw scan history remains transient by default.
- Define retention, export and deletion policy before persisting incident evidence.
- Log actor ID, organisation ID, action, target ID, timestamp and non-sensitive metadata. Avoid logging notice contents or submitted secrets unnecessarily.
- Keep public responses free of private member data and internal approval notes.

## Acceptance criteria for the first vertical slice

1. An organisation admin can create an organisation in a controlled seeded/admin workflow.
2. The organisation admin can add an issuer and an independent approver.
3. Issuer can submit a draft notice.
4. A distinct approver can approve and publish it.
5. Published notice has a stored digest, Ed25519 signature and key ID.
6. Public verification reports valid/current for an unchanged, published notice.
7. Modifying a signed field causes signature/digest verification failure.
8. Revoked, expired, superseded and unknown references are not displayed as valid/current.
9. Issuer cannot approve their own sensitive notice.
10. A user from a different organisation cannot read or mutate private records by changing an ID.
11. No private key or private member fields appear in public responses.
12. Tests run without a production database; an optional integration test uses a dedicated isolated test database.

## Evidence and evaluation

Use synthetic institution, notice and payment examples in demonstrations. Build a labelled test set covering genuine/current, tampered, unknown, expired, revoked, superseded, copied-QR-with-different-context and wrong-domain scenarios. Report actual test counts and outcomes; never claim detection accuracy without a properly labelled, held-out dataset and analysis.

## Research grounding

- RBI discussion paper (9 April 2026): digital-payment fraud safeguards and social-engineering context. A discussion paper is not a college-specific regulation.
- Google Research CASE (2025): model for safe conversational collection of scam narratives and structured case intelligence; Google's reported outcome is not a CyberRakshak result.
- NIST CSF 2.0 and NIST SP 800-61 Rev. 3: organisational cyber-risk and incident-response structure.
- OWASP Top 10:2025 and OWASP GenAI LLM Top 10:2026: web and AI security review references.
- NPCI fraud awareness: QR scanning plus UPI PIN is a payment action, not a receipt action.
- MongoDB multi-tenant architecture guidance: application-tier tenant isolation must be deliberately designed.

## Primary source links

- RBI: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23810
- MHA/PIB: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674
- Google CASE: https://research.google/pubs/case-an-agentic-ai-framework-for-enhancing-scam-intelligence-in-digital-payments/
- NIST CSF 2.0: https://www.nist.gov/cyberframework
- NIST SP 800-61r3: https://csrc.nist.gov/pubs/sp/800/61/r3/final
- OWASP Top 10:2025: https://top10.owasp.org/2025/
- OWASP GenAI LLM Top 10:2026: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10
- NPCI fraud awareness: https://www.npci.org.in/fraud-awareness
- MongoDB multi-tenant architecture: https://www.mongodb.com/docs/atlas/build-multi-tenant-arch/

## Known open decisions

- Institutional identity proofing and the person authorised to approve the initial campus.
- Key provisioning, rotation, backup and emergency revocation.
- Notice retention and deletion policy.
- Whether PDF attachment integrity will be supported; the first slice signs text fields only.
- Accessibility and supported language acceptance criteria.
