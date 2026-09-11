# CyberRakshak — Easy Guide

This is the quick reference for understanding, running and changing the project without needing to remember the whole codebase.

## 1. What is CyberRakshak?

CyberRakshak is a cyber-safety and digital-literacy companion. A person can check something suspicious, understand warning signs, take a safer action, report an incident and learn from it.

The product principle is:

`Check → Understand → Act → Report → Learn`

## 2. Why the project is advanced

The goal is not to make the screen complicated. The advanced part is the connection between multiple safe systems:

- explainable scam/risk analysis
- India-specific cyber-safety journeys
- visual education with one focused image per core topic
- official awareness-media links
- quizzes and learning reinforcement
- incident-response guidance
- reporting and case tracking
- administrative review
- conversational AI Safety Copilot
- privacy and accessibility rules
- automated CI and scheduled maintenance
- a planned PostgreSQL + realtime architecture
- a planned ML/multimodal path with explicit safety gates

## 3. Why the UI is intentionally simple

A worried user should not see every feature at once. Each page answers one main question and has one dominant action.

The navbar therefore exposes only the most important destinations. Secondary pages are under **More**. Learning and emergency journeys are split into focused pages rather than one giant dashboard.

## 4. AI Safety Copilot

The chatbot is now a product surface, not a decorative widget.

### Current flow

`React Copilot → /api/chat → Gemini free tier → OpenRouter free fallback → deterministic fallback`

Provider credentials stay on the backend.

### AI environment values

In `backend/.env`:

```text
AI_PROVIDER=auto
GEMINI_API_KEY=your-own-key
GEMINI_MODEL=gemini-3.1-flash-lite
OPENROUTER_API_KEY=optional-own-key
OPENROUTER_MODEL=openrouter/free
```

Never paste a real API key into GitHub, frontend code or this guide.

### AI features

- multi-turn conversation
- English/Telugu/Hindi selection
- age-aware context
- guided safety tools
- learn mode
- privacy mode
- incident-response path
- quiz mode
- copy/regenerate
- local conversation persistence
- provider fallback

The design intentionally keeps privileged operations in application code instead of giving the model unrestricted agency.

See `docs/AI_CHATBOT_ARCHITECTURE.md` for the detailed workflow.

## 5. Visual education foundation

Each core learning card has one clear visual illustration. The detailed lesson remains on its own page so the learning center is not overloaded.

Current core topics include:

- Digital literacy
- Password security
- UPI/payment safety
- Social media safety
- Phishing/smishing
- Device/app safety

Expansion tracks cover AI/deepfake awareness, health/medical scam safety and human/online-abuse safety. Sensitive abuse topics are handled only through age-appropriate prevention, privacy and reporting guidance.

Official awareness material is kept separate and labelled as external source material.

## 6. Where to change things

### Frontend

- `frontend/src/App.jsx` — routes
- `frontend/src/App.css` — global design
- `frontend/src/components/Navbar/Navbar.jsx` — main navigation
- `frontend/src/components/PageShell/PageShell.jsx` — common page frame
- `frontend/src/components/Chatbot/Chatbot.jsx` — AI Copilot behavior/UI
- `frontend/src/components/Chatbot/Chatbot.css` — AI Copilot styling
- `frontend/src/services/chatService.js` — frontend AI API client
- `frontend/src/pages/Learn/Learn.jsx` — visual learning center
- `frontend/src/pages/Learn/Learn.css` — learning center design
- `frontend/src/pages/*` — individual feature pages
- `frontend/public/education/*` — one illustration per learning topic

### Backend

- `backend/server.js` — Express application and API registration
- `backend/routes/chat.js` — conversational AI endpoint
- `backend/services/chatService.js` — provider routing, AI prompt, fallback logic
- `backend/routes/*` — other API endpoints
- `backend/controllers/*` — request handling
- `backend/services/riskEngine.js` — explainable safety logic
- `backend/models/*` — current database models

### Data and ML

- `database/` — database work
- `ml/` — ML research foundation
- `docs/DATASET_CATALOG.md` — dataset research

## 7. How to run

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

## 8. How to test before pushing

```bash
cd backend
node -c server.js
npm test

cd ../frontend
npm run lint
npm run build
```

## 9. Git workflow

Create a feature branch from the latest `main`, make one logical change at a time, run the checks, then open a pull request.

Do not push secrets or `.env` files.

## 10. Automated maintenance

GitHub Actions runs frontend lint/build and backend syntax/tests on pull requests and pushes to `main`.

The scheduled maintenance workflow repeats the checks automatically and can create/update a GitHub issue when verification fails. Dependabot can propose dependency updates.

Automation should detect and report predictable problems. Security-sensitive application changes should still be reviewed before merging.

## 11. Database direction

The current application uses MongoDB/Mongoose. PostgreSQL is the target architecture. Realtime browser delivery should be implemented after the database migration is validated.

## 12. Common bug checklist

When something breaks:

1. Check the browser console.
2. Check the backend terminal.
3. Run `node -c server.js`.
4. Run `npm test` in backend.
5. Run `npm run lint` and `npm run build` in frontend.
6. Confirm API URLs and environment variables.
7. Check the newest GitHub Actions run.
8. Read the failure before changing code.

## 13. The rule for future additions

Do not add a feature only because the page has space. Add it because it solves a real safety or learning problem, then put it in the smallest sensible screen.

## 14. Product mindset

Build CyberRakshak as a product that is **simple for the user, visual enough to teach, explainable in its decisions, structured for developers, privacy-aware and honest about what is still being validated**.
