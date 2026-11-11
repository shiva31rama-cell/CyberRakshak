# Campus TrustDesk — architecture decision record
**Status:** Proposed design, not implemented in this commit.

## Decision
Build the first vertical slice as an organisation-scoped, signed campus-notice registry. Keep existing message/URL scanning, cyber-aware chat, learning and scam-reporting features as supporting capabilities.

## Why this is preferable
A general scanner/chat assistant is difficult to differentiate against existing consumer and public-sector tools. A campus notice source-of-truth workflow gives judges a testable operation: publish a trusted notice, verify its exact version and expose tampering, expiry, revocation and copied-QR limitations.

## Components
1. Organisation and membership boundary.
2. Issuer and approver workflow.
3. Canonical notice version and SHA-256 content digest.
4. Ed25519 digital signature using a server-only private key.
5. Public verification URL/opaque verification ID and QR.
6. Public read-only verifier exposing only published public fields.
7. Audit records for publish, supersede and revoke.
8. Browser QR decoding later; URL preview goes through existing structural analysis.

## Security requirements
- Never accept role, issuer identity or organisation scope from body parameters as authority.
- All protected reads/writes derive organisation membership from verified session and database state.
- Require publisher and approver to be different accounts for configured sensitive notice categories.
- Published version immutable; corrections make new version.
- Signature validates canonical fields and signing key ID; unknown key IDs fail closed.
- Revocation and expiry override prior signature validity in current status.
- Public verification reveals published notice only; drafts, personal information and internal audit details stay private.
- Public QR contains only an opaque reference/HTTPS page.
- Do not label the surrounding WhatsApp/SMS sender as verified.
- No blockchain, bank APIs, automatic payment, government complaint submission or external URL fetching in this MVP.

## Initial collection proposal
- Organisation: name, approved domains, status, owner, timestamps.
- OrganisationMember: user, organisation, role, active status.
- VerifiedNotice: organisation, verificationId, currentVersion, versions, lifecycle status.
- AuditEvent: organisation, actor, action, target, time, metadata allow-list.

## API proposal
- POST /api/orgs — controlled institution creation/onboarding.
- POST /api/orgs/:orgId/members — invitation/role assignment by authorised admin.
- POST /api/orgs/:orgId/notices — create draft.
- POST /api/orgs/:orgId/notices/:noticeId/publish — publish/sign if actor has issuer role and required approvals exist.
- POST /api/orgs/:orgId/notices/:noticeId/revoke — revoke with reason.
- GET /api/public/notices/verify/:verificationId — public status and canonical content.

Adapt naming to existing route conventions after the branch source is confirmed.

## Threat model summary
Assets: signing private key, verified notice integrity, organisation membership, incident/private reports, audit history.
Threats: forged issuer, cross-tenant IDOR, notice alteration, replay/copied QR, stale/revoked notice, leaked key, forged public ID enumeration, malicious pasted prompt injection.
Controls: server-side RBAC and tenant scoping, Ed25519 signatures, immutable versions, opaque random IDs, expiry/revocation, key rotation, rate limits, safe logging, explicit public field allow-list, human approval and tests.

## Verification tests required before claiming feature complete
- valid notice verifies.
- any signed content-field mutation fails.
- unknown verification ID returns not-found without leaking data.
- expired notice returns expired.
- revoked notice returns revoked.
- superseded version shows superseded and latest version.
- copied QR plus unrelated surrounding text displays canonical notice and mismatch guidance.
- non-member cannot create/publish/revoke.
- one organisation cannot access another organisation's records.
- issuer cannot self-approve a sensitive payment notice.
- public response contains no private fields.
