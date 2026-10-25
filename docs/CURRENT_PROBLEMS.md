# CyberRakshak 2.0 — Current Problems / Next Build Queue

| ID | Problem or gap | Priority | Action | Status |
|---|---|---:|---|---|
| B01 | MongoDB persistence is not yet proven end-to-end | S1/P0 | Connect Atlas, exercise CRUD, record evidence | OPEN |
| B02 | Analysis/incident history persistence is absent | P1 | Add minimal safe metadata models and retention rules | OPEN |
| B03 | Full multilingual switching is not implemented | P1 | Add language state and reusable content keys | IN DEVELOPMENT |
| B04 | Full accessibility matrix is not verified | P1 | Keyboard/focus/labels/contrast/screen-size audit | IN DEVELOPMENT |
| B05 | Social verification does not yet retrieve live evidence | P2 | Add permitted source/API adapters and evidence scoring | PLANNED |
| B06 | AI output needs a complete structured contract and tested invalid-output fallback | P1 | Added response schema validator for reply, provider, intent, incident type, triage stage and HTTPS source metadata; added controller fallback test and CI checks | IMPLEMENTED; CI PASSING (34 BACKEND TESTS) |
| B07 | Deterministic URL analysis needs broader regression coverage | P0 | Added hostname-boundary, private-host and inconclusive-result regressions; backend CI passed | REGRESSION TESTS ADDED; CI PASSING |
| B08 | URL analysis is heuristic only | P1 | Keep limitations explicit; later add a reviewed reputation evidence adapter | IMPLEMENTED WITH LIMITATION |
| B09 | CI should keep syntax, lint, tests and production-build checks aligned with changed modules | P1 | Backend tests, service-worker syntax, frontend lint and production build now pass; expand checks as modules are added | CI PASSING; FUTURE COVERAGE REVIEW |
| B10 | Browser/device verification is pending | P1 | Test phone, tablet, desktop, landscape and failure states | OPEN |
| B11 | AWS deployment is not yet verified | P1 | Deploy using selected architecture and capture health evidence | PLANNED |
| B12 | Final report must stay synchronized with actual software | P0 | Update only from verified implementation/evidence | IN DEVELOPMENT |
| B13 | Offline shell is implemented but not browser-verified | P1 | Verify first online cache, reload while offline, update behavior and API non-caching | CODE ADDED; BROWSER VERIFICATION PENDING |

## Release-blocking rule

S0/S1 issues and unresolved security/privacy failures block release. S2/S3 issues may proceed only with documented limitation, impact, mitigation and approval.

## Evidence rule

A feature is not marked **IMPLEMENTED** merely because code exists. The final audit must contain the test/result/evidence needed to prove the acceptance criteria.
