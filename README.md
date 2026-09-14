# CyberRakshak 🛡️

**AI-powered, multilingual cyber-safety assistant for practical digital safety.**

CyberRakshak is a mobile-first safety portal built around one simple journey:

**CHECK → UNDERSTAND → ACT → REPORT → LEARN**

It is designed to help people evaluate suspicious messages and links, learn safer digital habits, find official emergency/reporting channels, and document scam incidents without asking users to share secrets.

## Current product

- 🔎 **Safety Checker** for suspicious messages and URLs
- 🆘 **Emergency Help** with official Indian helpline and reporting paths
- 📚 **Visual learning** for phishing, UPI, passwords, social media and cyber-crime awareness
- ⚠️ **Scam reporting** with case numbers and admin workflow
- 🤖 **AI assistant** using an optional OpenAI-compatible provider with a safe local fallback
- 🌐 **English, Telugu and Hindi** language support
- 🔐 **Privacy-first safety messaging** — never request passwords, OTPs, UPI PINs, CVVs or recovery codes
- 👮 **Admin dashboard** for report status, feedback and live MongoDB-backed analytics
- 📱 **Responsive UI** optimized for mobile first, then larger screens

## Architecture

```text
Browser / Mobile
      │
      ▼
React + Vite frontend
      │  VITE_API_BASE_URL
      ▼
Express API
 ┌────┼───────────────┐
 │    │       │       │
Auth Scam    Quiz   Feedback
 │    │       │       │
 └────┴───────┴───────┘
          │
          ▼
      MongoDB Atlas
          │
          └── Optional AI provider
```

## Repository structure

```text
CyberRakshak/
├── frontend/              # React + Vite application
├── backend/               # Express + Mongoose API
├── .github/workflows/     # CI pipeline
├── render.yaml            # Render deployment blueprint
├── database/              # Database notes / future migration assets
└── deployment/            # Deployment documentation
```

## Local development

### 1. Backend

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Windows PowerShell can use `Copy-Item .env.example .env` instead of `cp`.

The API runs on `http://localhost:5000` by default. Health check:

`GET /health`

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

For local development, `frontend/.env.example` points the API client to `http://localhost:5000/api`.

## Environment variables

### Backend

Copy `backend/.env.example` to `.env` and configure:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random production secret
- `PORT` — server port
- `FRONTEND_URL` — allowed frontend origin(s), comma-separated when necessary
- `APP_PUBLIC_URL` — public application URL
- `AI_API_URL` — optional OpenAI-compatible chat completion endpoint
- `AI_API_KEY` — optional provider key
- `AI_MODEL` — provider model name
- `AI_SYSTEM_PROMPT` — optional custom system prompt

Do **not** commit `.env` files or provider credentials.

## Production checks

The GitHub Actions pipeline runs on pushes to `main` and pull requests targeting `main`.

It currently checks:

1. Locked backend dependency installation with `npm ci`
2. Backend syntax
3. Backend application/route loading
4. Backend tests
5. Locked frontend dependency installation
6. Frontend linting
7. Frontend production build
8. Final integration gate after backend and frontend checks pass

## Deployment

`render.yaml` defines a free-tier deployment shape with:

- Render Node web service for the API
- Render static site for the frontend
- MongoDB supplied separately, normally MongoDB Atlas
- Optional OpenAI-compatible AI provider
- SPA rewrite to `index.html`
- Health check at `/health`
- Deployment gated on successful checks

See `deployment/HostingGuide.md` for the deployment checklist.

## Database status

The application currently uses **MongoDB/Mongoose**. PostgreSQL migration is intentionally not part of the current production path. See `database/README.md` for the boundary between the current system and a future migration.

## Safety boundary

CyberRakshak is a defensive safety and education product. The AI assistant is instructed not to facilitate unauthorized access, credential theft, malware deployment or similar harmful activity. The product should never ask a user to provide a password, OTP, payment PIN, CVV, API key or recovery code.

For real incidents in India, the application should direct users toward the appropriate official channels rather than presenting itself as a replacement for law enforcement, banks or emergency services.

## Project status

The main product journey and deployment foundation are implemented. Final production readiness still depends on successful CI execution, real environment configuration, database availability, AI-provider configuration where desired, and end-to-end testing in the deployed environment.
