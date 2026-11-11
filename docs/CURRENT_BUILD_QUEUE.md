# Campus TrustDesk — Current Build Queue

## Implemented in branch (code present; not yet independently accepted as production behaviour)
- Organisation, organisation-member, verified-notice and audit-event Mongoose model definitions.
- Ed25519 canonical-payload digest/sign/verify service.
- Draft, submit, approve/publish, revoke and public-verification service/API skeleton.
- Distinct approver check: issuer cannot approve their own notice.
- Expiry state check on public verification.
- Synthetic crypto tests for valid signature and tamper/signature mutation.
- Product specification, evidence register, implementation plan and source baseline audit.

## Critical gaps before an end-to-end demo
1. Institutional verification and trusted initial organization-admin/member provisioning.
2. Durable public-key registry with key ID, rotation and historical key verification.
3. Correct current-status semantics and public verification responses for expired/revoked/superseded/invalid-signature states.
4. Concurrency and state-transition protections (atomic update/compare-and-set).
5. Tenant isolation tests for every private query and mutation.
6. End-to-end tests using an isolated MongoDB test database.
7. Frontend issuer/admin workflow, public verifier and QR generation/scan.
8. Approval policy: two distinct people for sensitive classes, not simply any user with both roles.
9. Frontend lint/build and full CI result on this branch.
10. Key backup, rotation, revocation and incident-recovery runbook.
11. Retention/deletion and audit-data policy.
12. Accessibility and complete English/Telugu/Hindi translation.

## Current truth
The code in this branch is an initial implementation slice. It has not been run locally in this conversation. No notice is claimed to have been end-to-end issued, signed, stored, retrieved and verified against a live MongoDB service. No production key has been configured. No application has been deployed.
