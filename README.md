# CyberRakshak 🛡️

**CyberRakshak** is an India-focused cyber-safety and digital-literacy platform for everyday users. The product combines simple education, explainable safety checking, incident guidance, scam reporting, case tracking and an administrative security view.

## Why this project exists

Many people do not need a complicated security dashboard. They need a calm answer to a simple question: **“Is this suspicious, and what should I do next?”**

CyberRakshak is designed around that journey:

`Check → Understand → Act → Report → Learn`

The product is especially designed for students, families, seniors, first-time digital users and rural/semi-urban communities where clear language and low-friction access matter.

## What makes CyberRakshak different

- **India-first scenarios:** UPI/payment fraud, SIM/telecom risks, KYC/impersonation, fake jobs, phishing, credential/OTP theft and digital-arrest impersonation.
- **Explainable by default:** the user sees why a message/link looks risky instead of receiving only a black-box score.
- **Safety + education in one loop:** a suspicious incident can become a learning opportunity.
- **Official escalation guidance:** the product guides users toward appropriate official channels instead of pretending to replace authorities.
- **Privacy-aware:** the interface is designed not to request passwords, UPI PINs, transaction OTPs, CVVs or authentication tokens.
- **Simple UI/UX:** one page has one main purpose, with secondary features progressively disclosed rather than filling every screen with buttons.
- **Honest roadmap:** screenshot/OCR, voice/call analysis, deepfake analysis, live threat intelligence, custom ML, real-time alerts and Flutter are marked planned until validated.

## Current architecture

```text
Browser / Mobile Web
        │
        ▼
React + Vite frontend
        │
        ▼
Node.js + Express API
        │
        ├── Authentication / JWT
        ├── Learning + Quiz
        ├── Scam Reporting + Case Tracking
        ├── Safety Analyzer + Risk Engine
        ├── Feedback + Admin SOC
        └── Defensive AI Chat
        │
        ▼
Current persistence: MongoDB / Mongoose
Planned persistence: PostgreSQL
        │
        ▼
Future realtime: WebSockets/Socket.IO + PostgreSQL signaling
```

> PostgreSQL is the planned target architecture. The existing production code should not be described as PostgreSQL-backed until the migration is completed and tested.

## Repository structure

```text
CyberRakshak/
├── .github/workflows/       # CI and automated maintenance checks
├── backend/                 # Express API, routes, controllers and models
├── frontend/                # React/Vite application
├── database/                # Database schema and migration material
├── deployment/              # Render/deployment configuration and guides
├── docs/                    # Product, privacy, UI/UX, data and operational docs
├── ml/                      # Safe ML research/training foundation
├── research-paper/          # Research material
├── testing/                 # Test plans and evidence
├── render.yaml              # Render Blueprint
└── README.md                # Project entry point
```

## Main user routes

| Route | Purpose |
|---|---|
| `/` | Simple entry points into the product |
| `/check` | Analyze a suspicious message or URL |
| `/learn` | Cyber-safety learning |
| `/digital-literacy` | Digital-literacy lessons |
| `/digital-literacy-quiz` | Scenario-based quiz |
| `/emergency-help` | Incident-response guidance |
| `/report-scam` | Scam reporting and case flow |
| `/feedback` | Product feedback |
| `/admin` | Authorized administrative workflow |

Learning modules for UPI, cybercrime awareness, social-media safety and password security are intentionally available as focused pages rather than being placed on one giant screen.

## Local development

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Configure the values in `backend/.env.example`. Never commit `.env` or real credentials.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to your backend API, for example `http://localhost:5000/api`.

### Verify before pushing

```bash
cd backend
npm test
node -c server.js

cd ../frontend
npm run lint
npm run build
```

## How to make changes safely

1. Create a feature branch from the current main/development baseline.
2. Make one coherent change at a time.
3. Keep page purpose narrow; do not add unrelated buttons to existing screens.
4. Update the relevant documentation when architecture or user behavior changes.
5. Run backend tests and frontend lint/build locally.
6. Push the branch and let GitHub Actions validate it.
7. Review the diff and the rendered UI before merging.

For the detailed workflow, read `docs/DEVELOPMENT_GUIDE.md`.

## Automated engineering safety

CyberRakshak includes a CI/maintenance strategy so problems can be detected without requiring a person to remember every check manually.

- Pull requests run backend syntax/tests and frontend lint/build.
- Scheduled maintenance can repeat these checks and report failures.
- Dependency monitoring should create reviewable updates rather than silently changing production code.
- Production deployments should expose a health endpoint and verify it after release.

Automation detects and reports problems; it should not silently rewrite security-sensitive application logic.

## Documentation map

- `docs/DEVELOPMENT_GUIDE.md` — easy day-to-day developer guide
- `docs/UI_UX_SYSTEM.md` — page templates and interface rules
- `docs/PRODUCT_COMPLETENESS_MATRIX.md` — implemented vs planned capability matrix
- `docs/DATASET_CATALOG.md` — dataset research and licensing notes
- `docs/PRIVACY_AND_DATA_SAFETY.md` — privacy and data-handling baseline
- `docs/INDIA_SAFETY_RESOURCES.md` — official escalation guidance
- `docs/REALTIME_EVENT_CONTRACT.md` — realtime event architecture
- `ml/README.md` — safe ML development path
- `deployment/DEPLOYMENT.md` — deployment procedure

## Important product boundaries

CyberRakshak is an advisory safety platform. It does not independently investigate crimes, freeze funds, recover compromised accounts, guarantee that a site/message is safe, intercept private calls or replace official reporting authorities.

Never expose API keys in the frontend. Never execute or crawl dataset URLs merely because they are labelled malicious. Keep raw third-party datasets out of the repository unless redistribution rights are verified.

## Status

The project is actively being hardened and upgraded. The repository distinguishes **implemented** capabilities from **planned** capabilities on purpose. Production claims should be made only after implementation, tests, security review, privacy review and deployment verification pass.
