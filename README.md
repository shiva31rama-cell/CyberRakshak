# CyberRakshak 🛡️

CyberRakshak is an AI-powered cyber-safety and digital-literacy platform designed to help users learn about common cyber threats, improve safe online behaviour, report scams, track submitted cases, and provide feedback.

## Current platform

- React + Vite frontend
- Node.js + Express backend
- MongoDB persistence with Mongoose
- JWT-based authentication with user/admin roles
- Cyber-safety learning modules
- Digital-literacy quiz and result flow
- Scam reporting with real backend case numbers
- Privacy-limited public case tracking
- Admin Security Operations Center for reports, analytics and feedback
- Defensive AI chat API with configurable provider integration and safe fallback
- Helmet, CORS and rate limiting on the API
- GitHub Actions CI for backend syntax/tests and frontend lint/build

## Repository structure

```text
CyberRakshak/
├── backend/             # Express API, controllers, models and routes
├── frontend/            # React/Vite application
├── database/            # Database-related documentation/assets
├── deployment/          # Deployment configuration/documentation
├── docs/                # Project documentation
├── research-paper/      # Research material
├── testing/             # Test documentation and cases
├── render.yaml          # Render production Blueprint
└── .github/workflows/   # CI pipeline
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

## Production deployment

The recommended simple production stack is **MongoDB Atlas + Render**:

- MongoDB Atlas hosts the managed MongoDB database.
- Render hosts the Express backend as a Web Service.
- Render hosts the React/Vite frontend as a Static Site.
- GitHub remains the source-control and CI system.

The repository includes `render.yaml` and a step-by-step guide in `deployment/DEPLOYMENT.md`.

Production environment variables must be configured in the deployment platform and must never be committed to Git. The frontend's `VITE_API_BASE_URL` is injected during the frontend build, so it must point to the deployed backend before the production build runs.

## Production verification

After deployment, verify `/health`, registration/login, session restoration, learning/quiz submission, feedback submission, scam reporting and case tracking, admin report/analytics/feedback workflows, and the chatbot. Also confirm that browser requests no longer point to `localhost`.

## Important

Never commit `.env` files, credentials, tokens, database connection strings, or other secrets. Dependencies and generated build output should remain untracked through `.gitignore`.
