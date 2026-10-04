# CyberRakshak 2.0

CyberRakshak is an AI-powered, cybersecurity-focused digital-safety platform for everyday users. The product journey is:

**ASK → SCAN → LEARN → RESPOND → GET HELP**

It is designed for students, smartphone users, UPI users, first-time digital users and rural/semi-urban communities. It is **not** an official government authority and must distinguish guidance from official reporting channels.

## Current build branch

- Repository: `shiva31rama-cell/CyberRakshak`
- Working branch: `cyberrakshak-2.0-final`
- `main` is kept outside the feature build workflow.

## Current build

### User-facing capabilities

- **ASK** — cyber-only assistant with scope guard, grounded knowledge, incident triage and sensitive-input warnings.
- **SCAN MESSAGE** — structured message analysis with scam indicators, category, risk level, explanation and safe actions.
- **SCAN URL** — deterministic URL heuristics with cautious risk language and limitations.
- **LEARN** — digital-literacy and cyber-safety modules plus curated awareness videos.
- **QUIZ** — existing digital-literacy quiz foundation.
- **RESPOND** — guided Incident Assistant with safe actions, evidence preservation and secret-sharing warnings.
- **VERIFY** — first deterministic social-claim verification layer with an explicit “unverified is not false” rule.
- **GET HELP** — existing emergency/help and scam-reporting flows.
- **LANGUAGES** — shared English, తెలుగు and हिन्दी language state for core navigation/home content; full translation coverage is still in development.
- **RESPONSIVE WEB** — one React/Vite frontend is the current shared-code experience for phone, tablet and desktop layouts.

### Backend APIs

- `GET /health`
- `POST /api/chat`
- `POST /api/scan/message`
- `POST /api/scan/url`
- `POST /api/incidents`
- `POST /api/verify/social`
- Existing auth, quiz, feedback and scam-report APIs.

## Architecture

```text
Responsive React/Vite
       |
       +--> ASK / SCAN / LEARN / RESPOND / VERIFY / GET HELP
       |
       v
REST API
       |
       v
Node + Express
  |       |        |
  |       |        +--> validation / safety / rate limiting
  |       +-----------> deterministic cyber analysis
  +-------------------> AI provider boundary + grounded knowledge
       |
       v
MongoDB Atlas foundation
```

The architecture deliberately separates deterministic safety checks from AI generation. A heuristic result is not proof of fraud or maliciousness.

## Technology

### Frontend
- React 19
- Vite 8
- React Router
- Responsive CSS
- Shared language state

### Backend
- Node.js
- Express 5
- Mongoose / MongoDB Atlas
- JWT / bcryptjs
- Helmet
- CORS
- express-rate-limit

### AI
The provider is configured on the backend only. The assistant uses cyber relevance checks, sensitive-input protection, grounded knowledge and a safe fallback when AI configuration is unavailable.

## Local setup

### 1. Install dependencies

```powershell
cd frontend
npm install

cd ..\backend
npm install
```

### 2. Configure backend

Create `backend/.env` from `backend/.env.example` and configure:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=<your-mongodb-uri>
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_KEY=<server-side-key>
AI_MODEL=<model-name>
```

Never put `AI_API_KEY`, MongoDB credentials or JWT secrets in the frontend.

### 3. Start backend

```powershell
cd backend
npm run dev
```

### 4. Start frontend

In another terminal:

```powershell
cd frontend
npm run dev
```

Or from the repository root:

```powershell
npm run dev
```

## Verification commands

```powershell
npm test
npm run lint
npm run build
```

Runtime verification still requires a configured MongoDB environment for the full backend startup path.

## Safety boundaries

- Never request or store passwords, OTPs, PINs, CVVs, recovery codes or API keys.
- Do not claim a message or URL is malicious without sufficient evidence.
- “Unverified” must never be presented as “False.”
- Official government/bank/reporting resources must be clearly distinguished from CyberRakshak.
- The platform must not facilitate unauthorized access, credential theft, malware, evasion or other harmful cyber activity.
- Future RAG/vector search, live social evidence retrieval, OCR/image scanning, voice, advanced ML and native mobile apps are **not claimed as complete** until built and verified.

## AWS direction

The selected deployment direction is AWS. The production deployment remains a build/verification task. The final architecture will use managed AWS delivery/compute/secrets/monitoring services with MongoDB Atlas for application data, subject to cost, security and runtime validation.

## Documentation

- `docs/IMPLEMENTATION_AUDIT.md`
- `docs/CURRENT_PROBLEMS.md`
- `docs/AI_WORKFLOW.md`
- `docs/API.md`
- `docs/SECURITY.md`
- `docs/FUTURE_ROADMAP.md`

## Build truth

A feature is marked **IMPLEMENTED** only after code, integration, tests and evidence support the acceptance criteria. Planned work remains clearly separated from implemented work.
