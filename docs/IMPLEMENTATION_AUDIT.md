# CyberRakshak 2.0 — Implementation Audit

## Current build target

- Repository: shiva31rama-cell/CyberRakshak
- Working branch: codex/cyberrakshak-security-hardening
- Pull request: #9, targeting cyberrakshak-2.0-final
- Product journey: ASK → SCAN → LEARN → RESPOND → GET HELP
- Release rule: CODE → TEST → RESULT → EVIDENCE → DOCUMENTATION

## Current implementation status

| Feature | Current state | Evidence path |
|---|---|---|
| Frontend and backend foundation | Implemented | frontend/, backend/ |
| MongoDB connection and safe synthetic CRUD smoke | Code implemented; live CRUD step skipped because the private MONGODB_TEST_URI Actions secret is missing | backend/config/db.js, backend/scripts/mongodb-persistence-smoke.js |
| Report data privacy | New case references are random; public lookup exposes only reference/status/date; report form lists stored fields; retention/deletion policy remains open | backend/services/caseNumberService.js, backend/controllers/scamReportController.js, frontend/src/pages/ScamSolutions/ |
| Message and URL scanning | Deterministic triage; not a reputation verdict | backend/services/analysis/ |
| Social claim check | Local claim triage plus official PIB RSS candidate retrieval displayed as safe linked leads; no social platform scraping and no truth verdict from keyword overlap | backend/services/verification/, frontend/src/pages/SocialVerification/ |
| Offline shell | Service worker caches app shell/static assets only and bypasses /api; Chromium offline smoke passed | frontend/public/sw.js, frontend/scripts/offline-browser-smoke.mjs |
| Browser sizes | CI emulates 390px, 820px and 1440px layouts; physical device and assistive-technology checks remain open | .github/workflows/ci.yml |
| Deployment | Docker Compose and AWS ECS Fargate templates/workflow added; no cloud resources deployed | Dockerfiles, docker-compose.yml, deployment/aws/ecs.yml, .github/workflows/aws-deploy.yml |
| Multilingual UI | English, Telugu and Hindi strings cover shared navigation and home content; other page content remains partial | frontend/src/contexts/LanguageContext.jsx |
| Accessibility | Core labels/ARIA remain; complete keyboard, contrast, screen-reader and device audit remains open | frontend/src/ |
| Auth | JWT/bcrypt foundation with protected current-user and logout routes | backend/middleware/auth.js |
| AI | Provider boundary, grounding and response-contract fallback | backend/controllers/chatController.js, backend/services/ai/ |
| Chat secret handling | Pattern-detected labeled secrets keep the full conversation on the application fallback rather than forwarding it to the configured AI provider | backend/services/safety/sensitiveInputService.js, backend/tests/chatController.test.js |
| Request limits | Explicit trusted proxy hop count keeps per-client rate limits useful behind Compose NGINX and the AWS ALB; public report and feedback endpoints are limited | backend/server.js, docker-compose.yml, deployment/aws/ecs.yml |
| RAG, OCR, voice, native mobile and analytics | Planned; not claimed as implemented | docs/FUTURE_ROADMAP.md |

## Current architecture

React/Vite responsive web app → shared REST API → Node/Express safety and analysis services → MongoDB Atlas.

The web container serves the SPA and proxies API paths in local Compose. AWS uses separate Fargate web/API services behind an HTTPS Application Load Balancer. Runtime secrets are referenced from AWS Secrets Manager.

## Important truth boundary

The project provides deterministic message/URL heuristics and a social-claim triage layer. The PIB RSS adapter retrieves candidate press releases using local keyword overlap; it does not establish whether a claim is true or false. The UI validates official PIB HTTPS links before rendering them. The application does not scrape social platforms. Offline app-shell support does not make API-backed actions available offline.

## Latest implementation work

- Added bounded retrieval from the official PIB press-release RSS feed, with a fixed source URL, HTTPS host validation, timeout, response-size cap, redirect rejection and a short in-memory feed cache.
- Updated the social-verification screen to display candidate items, source status, publication date and shared keywords while clearly stating that matches are not a fact-check verdict.
- Added a Chromium CI smoke script for mobile/tablet/desktop-sized viewports, service-worker cache activation, offline deep-link loading, and network-only API calls.
- Added production Dockerfiles, local Compose health checks, NGINX SPA/API routing, ECS Fargate CloudFormation, and a manual GitHub OIDC deployment workflow.
- Prevented chat conversations containing pattern-detected labeled secrets from reaching the external AI provider and added a regression test.
- Changed scam report references to random 128-bit values, removed personal details from public status lookups and submission responses, and disclosed stored report fields and reporting limits in the form.
- Connected the ASK actions in navigation, home and footer to the same chatbot; removed fake social links, unimplemented policy links, unsupported trust badges and hard-coded emergency contact claims from the footer.
- Configured explicit trusted-proxy hop counts for local Compose and AWS ALB deployments and added rate limits to public scam-report and feedback endpoints.
- Kept chat, scan and incident histories transient as the MVP privacy decision until consent, retention and deletion requirements are approved.
- Made the language selector persist safely and set the document language attribute.
- Recorded the live MongoDB, AWS, physical-device and assistive-technology checks as external work until those environments are available.

## Verification evidence

GitHub Actions run [40297526993](https://github.com/shiva31rama-cell/CyberRakshak/actions/runs/40297526993), for commit 1ab66f4c548e71d7975f789539a023458416606b, completed successfully on 2026-10-26. Backend syntax checks, backend tests, backend container build, frontend lint/build, Chromium responsive/offline smoke, and frontend container build passed. The optional MongoDB step explicitly skipped because the MONGODB_TEST_URI secret was not configured; live database CRUD is therefore unverified.

A live MongoDB CRUD run still requires a new private test-only credential. AWS deployment requires an AWS account, protected GitHub environment and the documented network/resources. Physical acceptance requires real target devices and assistive-technology testing. No cloud resources were deployed.
