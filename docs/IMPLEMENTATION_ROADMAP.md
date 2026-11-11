# CyberRakshak 3.0 — implementation roadmap
**Branch:** feat/campus-trustdesk-mvp  
**Status:** Planning artefact only. No feature code has been added by this commit.

## Phase 0 — Verify and stabilise baseline
- Use the reviewed security-hardening commit as source candidate.
- Review PR #9 and its unusual file-change volume (3979 changed files; dependency cleanup is a major portion).
- Run backend tests, frontend lint/build, browser smoke and container builds locally/CI.
- Resolve dependency advisories and remove generated node_modules from Git.
- Verify a dedicated test-only MongoDB URI; never use a production database for destructive smoke tests.
- Rotate any previously exposed credentials.
- Capture actual test evidence and environment versions.

## Phase 1 — Campus identity and tenant isolation
- Add Organisation and OrganisationMember models.
- Implement controlled one-campus onboarding.
- Add server-side membership and role middleware.
- Define roles: platform_admin, organization_admin, issuer, finance_approver, incident_responder, staff, student.
- Add cross-tenant and role-escalation tests before adding tenant data.

## Phase 2 — Verified notice vertical slice (first release gate)
- Create draft notice.
- Add issuer and optional independent approver.
- Canonicalise exact notice fields.
- Hash with SHA-256 and sign Ed25519; server-only private key and key ID.
- Generate QR containing public HTTPS URL and opaque ID.
- Public verification page shows canonical notice, issuer, version, issue/expiry and current status.
- Add immutable version, supersede, revoke and expiry handling.
- Pass tamper, replay, unknown-ID, copied-QR and tenant isolation tests.

## Phase 3 — Payment Instruction Guard
- Store approved masked institutional payment instructions.
- Change requests require reason and second-person approval.
- Compare submitted instruction against current record and clearly report mismatches.
- Never ask for UPI PIN/OTP/card details; never initiate transactions or claim bank integration.

## Phase 4 — Improve threat analysis
- Preserve deterministic message and URL analysis.
- Rename heuristic confidence to a rule-signal descriptor; do not portray it as calibrated probability.
- Add browser QR decode; send only decoded HTTP(S) URL for analysis.
- Add one provider adapter only after checking terms, privacy and rate limits.
- Never fetch arbitrary URLs from backend.

## Phase 5 — Incident Desk and language support
- Persist only user-consented incident records.
- Add assignment, status timeline, responder notes and deletion/retention.
- Complete key English/Telugu/Hindi paths, including errors and safety content.
- Keep raw scans/chat transient by default.

## Phase 6 — College demo and pilot
- Synthetic sample college, notices and payment refs.
- Campus Trust Station on existing laptop/tablet.
- Five-minute demo: publish, verify, tamper, QR preview, payment mismatch, incident case.
- Evaluation report with dataset sizes, test outcomes and limitations.
- Small supervised user study after college approval.

## Definition of done
A feature is complete only when its API, UI, permission checks, tests, failure modes, documentation and CI evidence agree. A passing build alone is not proof of security or production readiness.
