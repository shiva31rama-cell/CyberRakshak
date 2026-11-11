# CyberRakshak Baseline Audit — 11 November 2026

## Repository check

- Repository: `shiva31rama-cell/CyberRakshak`
- Default branch: `main`
- Candidate source branch: `codex/cyberrakshak-security-hardening`
- Candidate head: `748963848a632b94a52d6529170128d41fc34b70`
- Existing PR #9: open; head is the candidate branch; base is `cyberrakshak-2.0-final`.
- PR #9 is not modified or merged by this feature work.
- New feature branch created from the candidate branch: `feat/campus-trustdesk-mvp`.

## Existing implementation confirmed by static tree/source review

- React 19 + Vite frontend.
- Express 5 + Node backend.
- MongoDB/Mongoose models and connection.
- JWT/Bcrypt authentication baseline.
- AI provider boundary and chat response contract.
- Cyber-relevance classification and sensitive-input handling.
- Deterministic message and URL analysis services.
- Incident guidance controller/service.
- Social-claim triage plus bounded official PIB evidence lookup.
- Existing learning, quizzes, feedback and scam-report modules.
- Three-language selector with partial English/Telugu/Hindi coverage.
- Docker/Compose/AWS deployment templates and GitHub Actions CI.

## Material gaps confirmed

- No organisation or organisation-membership model in candidate source tree.
- No tenant-isolation layer for campus-owned entities.
- No verified notice model or publish/approve/revoke/version workflow.
- No Ed25519 notice signing or public verification API.
- No payment-instruction change approval workflow.
- Incident endpoint returns guidance; no persistent incident-case workflow.
- Live URL reputation adapter is not part of the current default flow.
- Multilingual coverage is partial.
- Live MongoDB CRUD and deployed AWS resources are not proven by existing CI.

## Baseline evidence

- GitHub Actions run `40314791180` on 26 Oct 2026 completed successfully for candidate commit `748963848a632b94a52d6529170128d41fc34b70`.
- Candidate audit document says the optional live MongoDB CRUD integration step was skipped because private `MONGODB_TEST_URI` was not configured.
- Candidate audit document says no AWS resources had been deployed.
- Uploaded ZIP `CyberRakshak-main.zip` is older than candidate branch and has tracked dependency artifacts; do not use it as the development base.

## Test status for this work

This document records a remote/static source and CI-evidence audit. It does not claim that the code has been installed and re-run locally during this phase. Feature-specific tests must be executed in CI before claiming implementation is verified.

## Known next action

Implement the organisation + signed notice vertical slice in this feature branch. Review code diffs and CI output before opening a draft PR.
