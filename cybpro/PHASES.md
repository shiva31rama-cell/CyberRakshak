# CYBPRO: Two-Phase Delivery Plan

Workload target: 100 effort points, split 50/50. These are planning estimates, not a promise that the effort is equal in calendar time.

## Phase 1 — Core protection (50 points)

1. Foundation and secure contracts — 10 points
   - Fresh frontend/API/service structure, configuration validation, typed contracts, OpenAPI, CI, threat model, safe error handling.
2. Text and URL analysis — 10 points
   - Message indicators, safe URL parsing/normalization, deterministic baseline rules, risk and confidence kept separate.
3. Evidence connectors — 10 points
   - Provider adapters for supported public threat feeds, timeouts, caching, source timestamps, rate-limit handling, graceful degraded mode.
4. Explainable results and language support — 10 points
   - Structured reports, evidence references, unknown/conflicting outcomes, English and Telugu core flows, AI output schema validation and non-AI fallback.
5. End-to-end incident journey and quality — 10 points
   - Responsive UI, safe incident checklist, verified official help links, benchmark dataset, unit/integration/E2E tests, setup docs and demonstration.

### Phase 1 exit gate (all required)
- Clean install and documented local start.
- CI passes; tests cover benign, suspicious, malformed, unknown, unavailable-source, and conflicting-evidence cases.
- Every report distinguishes risk from confidence and records source freshness when sources are used.
- Sensitive values are not requested; raw submissions are not retained by default.
- File and URL inputs are validated and size-limited.
- Benchmark metrics are generated from a versioned test set; no unsupported accuracy claims.
- English/Telugu core journey works end to end.
- Reviewer checklist and evidence are committed.
- Phase 2 is blocked until all criteria pass.

## Phase 2 — Multimodal and advanced intelligence (50 points)

6. Safe file ingestion and screenshot analysis — 10 points
   - Allowlisted types, signature-based type checks, limits, isolated parsing, OCR, redaction, no execution of uploaded content.
7. Audio and video analysis — 10 points
   - Speech-to-text and sampled-frame extraction; time/duration/size limits; explain coverage and limitations.
8. Multimodal model and model routing — 10 points
   - Local/open-weight model option, provider abstraction, fallback, measured latency/memory, model/licence inventory.
9. Public-claim verification and community reporting — 10 points
   - Evidence-led verdicts, source provenance, consent-based reporting, deduplication, abuse prevention, moderator review.
10. Quantum experiment and production hardening — 10 points
   - Small Qiskit classification experiment compared fairly against classical baselines; deploy, monitor, backup/restore, load/security/accessibility tests, runbooks.

### Phase 2 exit gate (all required)
- Multimodal tests include unsupported, corrupt, oversized, and adversarial inputs.
- No file type is described as supported unless the ingestion and safety pipeline handles it.
- AI and quantum components can fail without disabling deterministic protection.
- Benchmark includes precision, recall, F1, false-positive rate, latency, and documented limitations.
- Deployment, monitoring, recovery, privacy, security, and handover documentation are verified.

## Rules for both phases
- One small vertical slice at a time: implement → test → review → document.
- Never commit API keys, passwords, tokens, or private datasets.
- Keep legacy CyberRakshak files untouched until the replacement is verified and deletion is explicitly confirmed.
- Record PLANNED / IN DEVELOPMENT / IMPLEMENTED / VERIFIED accurately.
