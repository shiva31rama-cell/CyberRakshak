# CyberRakshak 2.0 — Current Problems / Next Build Queue

| ID | Problem or gap | Priority | Action | Status |
|---|---|---:|---|---|
| B01 | MongoDB persistence needs a real dedicated test run | S1/P0 | Configure a new test-only URI privately, then run the guarded synthetic CRUD smoke test | CODE READY; EXTERNAL TEST CREDENTIAL BLOCKED |
| B02 | Analysis/incident history persistence is absent | P1 | Design explicit consent, metadata minimization, access and retention before storing history | OPEN |
| B03 | Full multilingual switching is not implemented | P1 | Translate remaining screens and user-facing safety guidance | IN DEVELOPMENT |
| B04 | Full accessibility matrix is not verified | P1 | Combine keyboard, focus, labels, contrast, screen reader and device checks | IN DEVELOPMENT |
| B05 | Social verification has no live social-platform adapter | P2 | Use documented platform APIs only; official PIB RSS candidate retrieval is now available | PARTIAL; NO SOCIAL SCRAPING |
| B06 | AI output needs a complete structured contract and tested invalid-output fallback | P1 | Added response schema validator and controller fallback coverage | IMPLEMENTED; CI PREVIOUSLY PASSING |
| B07 | Deterministic URL analysis needs regression coverage | P0 | Added hostname-boundary, private-host and inconclusive-result regressions | IMPLEMENTED |
| B08 | URL analysis is heuristic only | P1 | Keep limitation explicit until reviewed reputation evidence is integrated | IMPLEMENTED WITH LIMITATION |
| B09 | CI must cover syntax, lint, tests and production builds | P1 | Added backend/frontend checks, Chromium offline smoke, and production container builds | CODE ADDED; NEW CI RESULT PENDING |
| B10 | Physical browser/device verification is pending | P1 | Use Chromium viewport/offline smoke in CI, then complete real phone/tablet/desktop and assistive-technology acceptance | BROWSER AUTOMATION ADDED; PHYSICAL CHECK OPEN |
| B11 | AWS deployment is not live | P1 | Added Docker images, ECS Fargate CloudFormation and manual OIDC workflow | DEPLOYMENT CODE READY; AWS ACCOUNT SETUP PENDING |
| B12 | Final report must match verified software and evidence | P0 | Update only from actual implementation and run evidence | IN DEVELOPMENT |
| B13 | Offline shell is implemented but not browser-verified | P1 | CI now installs the production service worker, checks offline navigation and confirms API requests are not cached | AUTOMATION ADDED; CI RESULT PENDING |

## Release-blocking rule

S0/S1 issues and unresolved security/privacy failures block release. S2/S3 issues may proceed only with documented limitation, impact, mitigation and approval.

## Evidence rule

A feature is not marked implemented merely because code exists. The final audit must include the test/result/evidence needed to prove the acceptance criteria. Physical devices and a live MongoDB run require external environments that CI emulation cannot supply.
