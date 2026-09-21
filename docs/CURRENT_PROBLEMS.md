# CyberRakshak 2.0 — Current Problems and Verification Matrix

| Problem | Current Evidence | Root Cause | Impact | Fix | Priority | Status | Verification |
|---|---|---|---|---|---|---|---|
| Fragmented product experience | Existing pages are exposed as separate learning/emergency/report flows | Feature growth without a single information architecture | Product feels like a collection of pages | Reorganize around ASK / SCAN / LEARN / GET HELP | P1 | IN PROGRESS | UI review required |
| Legacy homepage | `frontend/src/pages/Home/Home.jsx` uses generic hero, old feature cards and static stats | Old landing-page implementation | Core product value is unclear | Replace homepage with task-first cyber-safety landing page | P1 | FIXING | Build + browser review |
| Static product statistics | Home contains `10K+`, `50+`, `100%`, `24/7` claims | Legacy marketing copy | Can imply unverified usage metrics | Remove unverified usage numbers | P1 | FIXING | Source inspection |
| Chat controller is monolithic | `backend/controllers/chatController.js` contains prompts, scope rules, triage, grounding, provider call and fallback | Business logic accumulated in controller | Harder to test and reuse | Extract services incrementally | P1 | OPEN | Service tests |
| Provider coupling | Chat controller directly builds provider HTTP request | No provider adapter | Harder to change providers/models | Add provider abstraction | P1 | OPEN | Provider mock test |
| Free-form AI contract | Current chat endpoint primarily returns `reply` text | Conversation-first design | Scanner/history/risk UI cannot rely on stable fields | Add validated analysis contract | P1 | OPEN | Contract tests |
| Risk not isolated | Risk is implied through AI/user wording rather than a dedicated risk engine | AI and business rules are mixed | Inconsistent severity | Extract deterministic risk service | P1 | OPEN | Risk unit tests |
| No dedicated message scanner | Current route set has chat but no scan-message API/page | Scanner capability not productized | Users must start a conversation instead of directly analyzing content | Add shared scanner API/UI | P1 | IN PROGRESS | Endpoint + UI test |
| Incident flow not productized | Chat controller has incident triage concepts | Triage exists inside chat | Users lack a guided incident workflow | Add incident service/page | P1 | OPEN | Workflow test |
| Analysis history not proven | Existing models do not include an analysis model | Persistence was not completed for assistant analyses | Users cannot reliably revisit analyses | Add safe analysis metadata persistence | P1 | OPEN | Mongo integration test |
| MongoDB is fail-fast but not end-to-end | `db.js` requires `MONGODB_URI`; existing models cover other features | No complete analysis persistence path | Local setup can run only when DB is configured; assistant history is incomplete | Verify environment + CRUD + health diagnostics | P0/P1 | PARTIAL | Local backend check |
| Source grounding needs end-to-end verification | Chat controller adds knowledge-base sources | Grounding exists but rendering/contract needs consistency | Source trust can be lost at UI boundary | Standardize source metadata | P1 | PARTIAL | API + UI test |
| Static awareness architecture | Multiple topic pages exist | Content is page-oriented | Harder to maintain/translate | Move toward reusable content model | P2 | OPEN | Component audit |
| Multimedia underused | Video component exists but home does not use a strong featured-video section | Landing page predates product vision | Educational mission is less visible | Add curated video section | P2 | OPEN | Browser review |
| Navigation not task-first | Navbar exposes Home/Learn/Quiz/Emergency/Report/Feedback | Navigation mirrors pages, not user goals | ASK/SCAN/GET HELP are not first-class | Unify navigation | P1 | IN PROGRESS | Browser review |
| Error-state consistency | Different features have separate async behaviour | No shared frontend API/error contract | Failures can feel like broken pages | Centralize API client and UI states | P1 | OPEN | Frontend tests |
| Sensitive-input logic is chat-centric | Secret detection is embedded in chat controller | No shared safety service | Scanner/incident endpoints may duplicate or miss protection | Extract shared service | P1 | OPEN | Unit tests |
| CI health must be verified | CI exists but source inspection alone cannot prove all checks | Health depends on actual workflow | False confidence | Run workflow and inspect results | P1 | OPEN | GitHub Actions |
| README is empty at checkpoint | Root README is zero bytes | Documentation drift | Setup and feature claims are unclear | Rewrite after implementation | P2 | OPEN | Documentation review |
| Committed node_modules | Repository tree contains `backend/node_modules` | Dependencies were committed | Large/noisy repository and potential platform issues | Remove tracked dependency tree after verifying ignore rules | P1 | OPEN | Git status / tree audit |

## Status meanings

- **FIXED** — changed and verified with an actual check.
- **IN PROGRESS** — implementation has started but requires further verification.
- **PARTIAL** — useful foundation exists, but the complete product path is not verified.
- **OPEN** — not yet implemented.
- **PLANNED** — intentionally deferred until the core product is stable.

## Rule

A code edit alone does not move a problem to FIXED. The application behaviour, API contract, build, or test must be verified first.
