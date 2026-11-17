# CyberRakshak — Live Jury Demo Implementation Plan

**Working branch:** `feat/jury-live-demo-integration`  
**Base:** `feat/campus-trustdesk-mvp`  
**Goal:** Use the existing Flutter/DartPad preview as a presentation client while progressively connecting it to real, observable backend workflows. Do not replace the existing React application or claim planned modules are live.

## Product architecture

- Flutter Web in DartPad: rapid interactive preview and jury-facing prototype.
- Existing React/Vite frontend: current repository web product.
- Express 5 API: single authoritative API and business-rule layer.
- MongoDB Atlas: durable records and audit metadata.
- Optional S3-compatible object storage: persistent file bytes; do not use ephemeral Render disk for user documents.
- AI provider adapter: server-side credentials only; deterministic scope/safety fallback when the model is unavailable.

Both web clients should call the same backend contract. DartPad's web origin must be explicitly allowed by CORS. A local dev server cannot be reached from a public DartPad session through localhost; deploy the API or use a secure tunnel during local demos.

## Truthful capability states

Every screen must distinguish:
- LIVE: request completed against the backend and persisted/verified where applicable.
- DEMO: local sample data or local-only state.
- UNAVAILABLE: backend/provider is not configured or request failed.
Never display a green success state when a request timed out, route is missing, or response failed validation.

## First integration milestone

Implement and test the following adapters while preserving all existing routes:
- `GET /api/health` and compatibility `GET /api/health` (database status and version)
- `POST /api/ai/assist` adapter over existing `POST /api/chat` contract; do not bypass cyber relevance or secret handling.
- `POST /api/analyze` adapter over existing message/URL scan services.
- `POST /api/incident-intake` as a consent-based intake workflow. Do not silently persist full sensitive chat transcripts; define minimal data, explicit consent, access controls, retention and deletion first.
- `GET /api/public/notices/verify/:id` adapter to the existing trust verification service.
- `GET /api/public/media` and `GET /api/public/resources` backed by explicit seeded/public records, not hard-coded "live" placeholders.
- `POST /api/payment-instructions/compare` based on an independently approved, versioned campus record; comparison only, never payment execution.
- File transfer routes must authenticate users, enforce object-level ownership/tenant authorization, validate file size/type/content, store bytes in private durable object storage, and issue controlled downloads. No public bucket or user-supplied path.
- Provide one documented client contract and example requests/responses.

## Campus TrustDesk vertical slice

Existing branch contains Organization, OrganizationMember, VerifiedNotice and AuditEvent model files plus a notice-signing service/API skeleton. The code must not be treated as end-to-end complete yet.

Before public demonstration of signed notices:
1. Verify and provision the first organization via an institution-controlled process; self-created organization remains pending.
2. Provision organization administrator and issuer/approver memberships using a trusted bootstrap command, never a client-supplied role.
3. Store public signing keys durably by key ID and support rotation/historical verification.
4. Require two distinct people for sensitive categories; issuer cannot approve own notice.
5. Make state changes atomic and immutable/version-bound.
6. Return distinct invalid, unknown, expired, revoked and superseded states.
7. Add tenant-isolation and tampering tests.
8. Provide front-end issuer, approver, QR and public-verifier workflow.

## AI assistant acceptance

- Preserve cyber-only scope.
- Keep pattern-detected secrets out of external provider calls.
- Use bounded conversation context; do not persist chat by default.
- Ground advice in curated CyberRakshak knowledge sources.
- Explain confidence/limitations; do not label heuristics as a probability or definitive forensic result.
- Ask one or two useful triage questions, avoid repeating answered questions.
- Escalate urgent financial cyber fraud to India's official response channels without waiting for app submission.
- Provider failure produces visibly labelled deterministic fallback.
- Add tests for greetings, off-topic requests, UPI fraud, phishing, account access loss, remote-access scam, Telugu/Hindi response, secret detection and malformed AI output.

## Presentation demo scenarios

Use synthetic data:
1. Live health check and backend status.
2. Submit a suspicious message; show indicators and limitations.
3. Ask AI for staged incident triage; show provider/fallback status.
4. Create a consented incident assistance record; show generated reference and session status.
5. Verify an untouched notice; tamper with a copy; show signature mismatch.
6. Upload and download a harmless sample file across two browser sessions/users with ownership checks.
7. Compare a payment instruction against an independently approved synthetic record.
8. Switch off backend or AI provider and show honest unavailable/fallback status.

## Environment variables

Only server-side secret storage:
- `MONGODB_URI`
- `JWT_SECRET`
- AI provider URL/model/token variables
- notice signing private key and key ID
- object storage endpoint, bucket, access key and secret
- explicit `FRONTEND_URLS` / allowed origin list
No secret belongs in DartPad, browser local storage, committed source, screenshots or demo slides.

## Release evidence

A feature is "live" only after:
- backend route tests pass;
- frontend lint/build and Flutter analyze/build pass in the relevant environment;
- DB integration tests pass against a dedicated non-production database;
- file upload/download tests verify authorization and persistence;
- browser/phone workflow is physically checked;
- screenshots and CI run are linked in the evidence register.

No production deployment, end-to-end Campus TrustDesk issue/sign/verify, R2 file persistence, or AI provider use is claimed by this plan.
