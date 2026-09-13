# CyberRakshak 🛡️

CyberRakshak is an AI-powered cyber-safety and digital-literacy platform designed to help users learn about common cyber threats, improve safe online behaviour, report scams, track submitted cases, and provide feedback.

## Current platform

- React + Vite frontend
- Node.js + Express backend
- MongoDB persistence
- JWT-based authentication with user/admin roles
- Cyber-safety learning modules
- Digital-literacy quiz and result flow
- Scam reporting with real backend case numbers
- Privacy-limited public case tracking
- Admin Security Operations Center for reports, analytics and feedback
- Helmet, CORS and rate limiting on the API
- GitHub Actions CI for backend syntax/tests and frontend lint/build

## Repository structure

```text
CyberRakshak/
├── backend/          # Express API, controllers, models and routes
├── frontend/         # React/Vite application
├── database/         # Database-related documentation/assets
├── deployment/       # Deployment configuration/documentation
├── docs/              # Project documentation
├── research-paper/   # Research material
├── testing/          # Test documentation and cases
└── .github/workflows/ # CI pipeline
```

## Run locally

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Configure `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, and any other values documented in `backend/.env.example`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API, for example `http://localhost:5000/api` for local development.

## Production readiness

Before deploying, verify that MongoDB is reachable, production secrets are configured outside Git, the frontend points to the deployed API, CORS is restricted to the deployed frontend origin, and CI passes both backend and frontend jobs.

## Important

Never commit `.env` files, credentials, tokens, database connection strings, or other secrets. Dependencies and generated build output should remain untracked through `.gitignore`.
