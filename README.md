# CyberRakshak 🛡️

CyberRakshak is a cybersecurity awareness and scam-reporting platform designed to help users learn safer digital practices, test their knowledge, report suspected scams, and track report status.

## Project structure

- `frontend/` — React + Vite web application
- `backend/` — Express + MongoDB REST API
- `database/` — database-related project resources
- `docs/` — project documentation
- `research-paper/` — research material
- `testing/` — testing resources
- `deployment/` — deployment configuration

## Core capabilities

- User registration and login with JWT authentication
- Cybersecurity learning and quiz workflows
- Quiz scoring and user result history
- Scam report submission and case-number tracking
- Admin-only quiz, feedback, scam-report, and statistics operations
- Configurable frontend API origin
- Security middleware, request limits, authentication rate limiting, and health endpoint

## Local development

### Backend

```powershell
cd backend
npm ci
# Create backend/.env from backend/.env.example and set MONGODB_URI and JWT_SECRET.
npm run dev
```

The API listens on the configured `PORT` (default `5000`).

### Frontend

```powershell
cd frontend
npm ci
npm run dev
```

Set `VITE_API_BASE_URL` when the backend is not available at the default local API URL.

## Security notes

- Never commit `.env` files, credentials, tokens, or private keys.
- Rotate any credential that was previously exposed in repository history.
- `node_modules/` and build output should remain untracked.

## Validation

Before pushing changes:

```powershell
cd backend
npm ci
npm test
node -c server.js

cd ..\frontend
npm ci
npm run lint
npm run build
```
