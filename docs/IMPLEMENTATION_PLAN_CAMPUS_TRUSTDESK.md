# Campus TrustDesk — Implementation Plan

## Source-of-truth branch

- Base candidate: `codex/cyberrakshak-security-hardening`
- Feature branch: `feat/campus-trustdesk-mvp`
- Do not merge or rewrite `main` or PR #9 as part of this work.

## Why this base

The hardening branch contains the newer backend analysis services, incident assistant, social evidence boundary, sensitive-input protection, responsive frontend, CI, Docker and deployment scaffolding. It is materially more complete than the uploaded `main` snapshot. PR #9 remains a separate open change into `cyberrakshak-2.0-final`; this feature branch is isolated from both default and release branches.

## Phase sequence

### Phase 0 — Audit and repository hygiene
- Verify the branch head and inherited CI evidence.
- Check ignored files, secrets and generated dependencies.
- Preserve existing endpoints and pages.
- Run unit tests, lint and build from the candidate branch.
- Document the current baseline and any failures.

### Phase 1 — Organisation identity and membership
- Define Organization and OrganizationMember models.
- Introduce membership roles separate from the legacy User.role.
- Add organisation-scoped audit events.
- Create tests for cross-tenant read/write denial.

### Phase 2 — Verified notice vertical slice
- Create draft.
- Submit for approval.
- Enforce distinct issuer/approver.
- Canonicalise fields.
- SHA-256 content digest.
- Ed25519 server-side signature with key ID.
- Public verification API returns only published notice details.
- Add current-state checks for expiry, revocation and supersession.
- Write negative tests first for forged, altered and cross-tenant content.

### Phase 3 — Presentation QR workflow
- Encode public verification URL with opaque ID.
- Decode camera QR locally in browser.
- Never auto-open decoded destination.
- Compare the QR target domain with official application domain.
- Test copied genuine QR attached to unrelated text.

### Phase 4 — Payment instruction guard
- Versioned approved payment reference.
- Propose-change and second-approval workflow.
- Mask sensitive fields.
- Audit the actor and approval sequence.
- No bank, UPI or payment execution integration.

### Phase 5 — Incident Desk
- Consent-based case creation.
- Assign responder, status, timeline and resolution.
- Retention and delete flow.
- AI can produce a reviewable draft only; a human confirms it.

### Phase 6 — Evaluation and presentation
- Synthetic test corpus and repeatable test commands.
- Accessibility and multilingual checks.
- Security review and deployment.
- Supervised campus pilot only with institutional approval.

## Engineering guardrails

- No code on main.
- No broad dependency additions unless necessary.
- Node built-ins preferred for crypto.
- No secrets or test data using real people.
- No arbitrary server-side URL fetching.
- Organisation IDs and roles come only from verified server-side membership.
- No AI tool can publish, approve, revoke or mutate records.
- Every claim in presentation must map to an evidence register entry or actual test run.

## Release gate

The first milestone is not complete until:
- all automated tests pass;
- positive notice verification is demonstrated;
- tampered notice fails verification;
- revoked/expired/superseded references show correct state;
- issuer cannot approve own sensitive notice;
- cross-organisation access tests fail closed;
- public responses expose no private keys or member data.
