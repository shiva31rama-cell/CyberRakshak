# CYBPRO — CYBer PROtection

**Product promise:** Check the evidence. Understand the risk. Take the safe next step.

CYBPRO is a privacy-conscious, evidence-first cyber-safety platform initially focused on scams affecting Indian digital users. It is a fresh implementation; the legacy CyberRakshak application is not being reused as the new product's codebase.

## Core user journeys
1. Analyze a suspicious message or URL.
2. Inspect observable indicators, supporting sources, freshness, and uncertainty.
3. Understand safe next actions in simple language.
4. If the user may have been affected, follow an incident-response checklist and verified official help guidance.
5. In the expanded release, analyze supported screenshots, audio, video, and documents through a controlled ingestion pipeline.

## Product principles
- Evidence before conclusions; unknown is an acceptable result.
- Keep threat risk separate from model confidence.
- No claims of detection accuracy until a reproducible benchmark supports them.
- Never ask for passwords, OTPs, UPI PINs, CVVs, or recovery codes.
- No raw user content retention by default.
- Treat uploaded content as untrusted data, never as instructions to the AI system.
- Use open-source software where suitable, while checking each model and data source's licence, API limits, and redistribution/commercial-use terms.
- Quantum research using Qiskit is experimental and will not be presented as production detection unless measured evidence supports the claim.

## Two implementation phases
See [PHASES.md](./PHASES.md). Phase 2 cannot start until Phase 1's exit gate is passed.

## Planned architecture
- Web: React, TypeScript, Vite, accessible responsive UI.
- Mobile: React Native, Expo, TypeScript for Android and iOS.
- API: Node.js, TypeScript, Fastify, schema-validated endpoints.
- Storage: PostgreSQL with Drizzle ORM for structured records; no content storage by default.
- AI/media service: Python service with provider adapters; classical detection remains available if AI is unavailable.
- Evaluation: versioned datasets, deterministic tests, precision/recall/F1/false-positive and latency reports.
- Engineering: OpenAPI, Vitest, Playwright, GitHub Actions, secret scanning, dependency checks, structured logs, and deployment runbooks.

## Web and mobile clients
Both clients use the same backend and report contract. The initial Expo mobile shell is in `apps/mobile/`; its text-analysis screen is a preview and requires a reachable API. URL/media routes are not implemented yet.

See [mobile and web architecture](./MOBILE_AND_WEB_ARCHITECTURE.md).

## Repository transition
This project is being built in the `cybpro/` directory on branch `cybpro-rebuild` while the legacy files remain untouched. Do not delete the old project until the new implementation is complete, reviewed, backed up, and the owner explicitly confirms the deletion.

## Status honesty
- PLANNED — specified, not implemented.
- IN DEVELOPMENT — code exists, incomplete.
- IMPLEMENTED — code exists and local checks have passed.
- VERIFIED — acceptance criteria and relevant tests/evidence passed.
