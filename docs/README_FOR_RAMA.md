# CyberRakshak — Easy Guide

This file is the quick reference for understanding and changing the project.

## What is CyberRakshak?

CyberRakshak is a cyber-safety companion. A person can check something suspicious, understand the warning signs, take safer action, report an incident and learn from it.

## The product idea

`Check → Understand → Act → Report → Learn`

## Why it is advanced

The important part is not adding the most buttons. The advanced part is connecting several useful layers safely:

- explainable safety analysis
- India-specific scam scenarios
- learning and quizzes
- incident guidance and reporting
- administrative review
- defensive AI assistance
- privacy-aware design
- a planned ML and realtime path

## Why the UI is intentionally simple

A person who is worried about a scam should not have to understand a dashboard. The screen should answer one question and present one main action.

That is why the navbar shows only the most important destinations. Secondary pages are under **More**, and individual routes are focused instead of putting everything on the home page.

## Where to change things

### Frontend

- `frontend/src/App.jsx` — routes and application structure
- `frontend/src/App.css` — global design tokens and accessibility defaults
- `frontend/src/components/Navbar/Navbar.jsx` — main navigation
- `frontend/src/components/PageShell/PageShell.jsx` — shared page title/purpose framing
- `frontend/src/pages/*` — individual features

### Backend

- `backend/server.js` — Express application and API registration
- `backend/routes/*` — API routes
- `backend/controllers/*` — request handling
- `backend/services/riskEngine.js` — explainable safety logic
- `backend/models/*` — current database models

### Data and ML

- `database/` — database work
- `ml/` — ML research foundation
- `docs/DATASET_CATALOG.md` — dataset research

### Documentation

- `docs/DEVELOPMENT_GUIDE.md` — day-to-day development
- `docs/UI_UX_SYSTEM.md` — UI rules
- `docs/PRODUCT_COMPLETENESS_MATRIX.md` — full capability status
- `docs/PRIVACY_AND_DATA_SAFETY.md` — privacy rules
- `docs/INDIA_SAFETY_RESOURCES.md` — India escalation guidance
- `docs/REALTIME_EVENT_CONTRACT.md` — realtime design
- `docs/AUTOMATION_OPERATIONS.md` — automated maintenance

## How to run

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## How to check for bugs

```bash
cd backend
node -c server.js
npm test

cd ../frontend
npm run lint
npm run build
```

## How GitHub helps automatically

Pull requests run the normal checks. Scheduled maintenance repeats them without someone remembering to start the commands. When the maintenance workflow fails, it can open or update a GitHub issue with the run link. Dependabot can propose dependency updates.

Automation should detect and report predictable problems. Security-sensitive application changes should still be reviewed before merging.

## Database direction

The current application uses MongoDB/Mongoose. PostgreSQL is the target database architecture. Realtime features should be added after that migration is validated.

## Important rule for every future change

Do not add a feature just because there is space on a page. Add it only when it improves a real user journey, then place it in the smallest sensible screen.

## Project mindset

Build CyberRakshak as a product that is **simple for the user, explainable in its decisions, structured for developers and honest about what is still being built**.
