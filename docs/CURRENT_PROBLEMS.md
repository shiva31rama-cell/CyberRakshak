# CyberRakshak 2.0 — Current Problems / Next Build Queue

| ID | Problem or gap | Priority | Action | Status |
|---|---|---:|---|---|
| B01 | MongoDB persistence needs a real dedicated test run | S1/P0 | Configure a new test-only URI privately, then run the guarded synthetic CRUD smoke test | CODE READY; LIVE CRUD SKIPPED (PRIVATE MONGODB_TEST_URI SECRET MISSING) |
| B02 | Chat, scan and incident history is not persisted | P2 | Keep sensitive histories transient until consent, access, retention and deletion requirements are approved | CLOSED BY PRIVACY DESIGN; REOPEN ONLY ON APPROVED REQUIREMENTS |
| B03 | Full multilingual switching is not implemented | P1 | Translate remaining screens and user-facing safety guidance | IN DEVELOPMENT |
| B04 | Full accessibility matrix is not verified | P1 | Combine keyboard, focus, labels, contrast, screen reader and device checks | IN DEVELOPMENT |
| B05 | Social verification has no social-platform adapter | P2 | Use documented platform APIs only; official PIB RSS candidate retrieval is available and shown in the UI | PARTIAL; NO SOCIAL SCRAPING |
| B06 | AI output needs a complete structured contract and tested invalid-output fallback | P1 | Added response schema validator and controller fallback coverage | IMPLEMENTED; BRANCH CI PASS |
| B07 | Deterministic URL analysis needs regression coverage | P0 | Added hostname-boundary, private-host and inconclusive-result regressions | IMPLEMENTED; BRANCH CI PASS |
| B08 | URL analysis is heuristic only | P1 | Keep limitation explicit until reviewed reputation evidence is integrated | IMPLEMENTED WITH LIMITATION |
| B09 | CI must cover syntax, lint, tests and production builds | P1 | Backend/frontend checks, Chromium smoke, and production container builds | PASS; WORKFLOW RUN 40308509037 |
| B10 | Physical browser/device verification is pending | P1 | Complete real phone/tablet/desktop and assistive-technology acceptance | CHROMIUM AUTOMATION PASS; PHYSICAL CHECK OPEN |
| B11 | AWS deployment is not live | P1 | Configure protected GitHub environment and AWS resources, then deploy deliberately | DEPLOYMENT CODE READY; AWS ACCOUNT SETUP PENDING |
| B12 | Final report must match verified software and evidence | P0 | Record CI result and external acceptance limits | UPDATED FROM VERIFIED EVIDENCE |
| B13 | Offline shell needs browser verification | P1 | Install the production service worker, check offline navigation and confirm API requests are not cached | CHROMIUM SMOKE PASS IN RUN 40308509037; PHYSICAL DEVICE CHECK OPEN |
| B14 | Automatic retention and backup purge policy for reports and feedback is not approved | P0 | Set a product retention period and verify database-backup expiry before production | OPEN; USER-INITIATED CASE-REFERENCE DELETION IMPLEMENTED |

## Privacy decision

Chat transcripts, message/URL scan history, and incident action plans are not persisted. Keeping these sensitive histories transient is the MVP decision because no approved consent, access, retention, or deletion requirements exist. Scam reports and feedback are separate database-backed workflows and their stored fields are disclosed in the security documentation and report form. Reporters can delete the active scam-report record with the private case reference; automatic retention and backup purge behavior still need an approved production policy.

## Release-blocking rule

S0/S1 issues and unresolved security/privacy failures block release. S2/S3 issues may proceed only with documented limitation, impact, mitigation and approval.

## Evidence rule

A feature is not marked implemented merely because code exists. The latest CI result verifies automated software checks, but cannot supply a live MongoDB run, AWS deployment, physical device or assistive-technology acceptance.
