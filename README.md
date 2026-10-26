# CyberRakshak

CyberRakshak is a web application for practical cyber-safety learning and incident triage. It helps people understand suspicious messages and URLs, learn safer digital habits, and find next steps after a suspected scam.

The service provides educational guidance. It is not a bank, police service, government authority, or source of definitive fraud determinations.

## What is implemented

- Cyber-safety learning modules and quizzes
- A cyber-focused assistant with a configured AI provider and a safe fallback
- Message and URL analysis with cautious, evidence-based language
- An incident assistant for immediate protective steps
- Social-claim triage that distinguishes “unverified” from “false”
- User authentication, feedback, and scam-report workflows
- Responsive React interface for desktop and mobile browsers

URL analysis is heuristic and does not visit the destination or query a live reputation service. Social-claim triage does not establish that an official source was checked live.

## Project structure

- \`frontend/\` — React and Vite user interface
- \`backend/\` — Express API, validation, safety services, AI boundary, MongoDB models, and API tests
- \`docs/\` — API, security, implementation status, and roadmap
- \`research-paper/\` — project research materials
- \`testing/\` — test plans and reported issues

The backend keeps HTTP routes and controllers separate from reusable services. MongoDB schemas in \`backend/models/\` define the application data model.

## Requirements

- Node.js 24 or a compatible current LTS release
- npm
- MongoDB for database-backed API routes
- Optional server-side AI provider credentials for AI chat

## Local setup

From the repository root, install each application’s locked dependencies:

\`\`\`powershell
npm ci --prefix backend
npm ci --prefix frontend
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
\`\`\`

Edit \`backend/.env\` with a MongoDB URI, a long random JWT secret, and any optional AI provider settings. Keep credentials out of the frontend and out of GitHub. The frontend’s \`VITE_API_BASE_URL\` should point to the backend API.

Start the API in one terminal:

\`\`\`powershell
npm run backend
\`\`\`

Start the frontend in another terminal:

\`\`\`powershell
npm run dev
\`\`\`

The frontend uses \`http://localhost:5000/api\` by default. The backend listens on port 5000 and accepts the frontend origin at \`http://localhost:5173\` by default.

## Validation

Run the backend unit tests, frontend lint, and production build from the repository root:

\`\`\`powershell
npm test
npm run lint
npm run build
\`\`\`

The optional MongoDB CRUD smoke test creates a synthetic report, reads it, updates it, and deletes only that report:

\`\`\`powershell
npm run test:db
\`\`\`

Before running it, set \`MONGODB_TEST_URI\` in \`backend/.env\` to a separate database whose name includes \`test\`. The script refuses other database names and never falls back to \`MONGODB_URI\`.

## Data and safety boundaries

- Never ask users to share passwords, one-time codes, PINs, CVVs, recovery codes, or API keys.
- Treat scanner results as guidance, not proof that a message or URL is malicious or safe.
- Clearly distinguish CyberRakshak guidance from official reporting and banking channels.
- Chat, scanner, and incident histories are not persisted. If the chat detects a labeled secret, it uses the application fallback and does not forward that conversation to the configured AI provider; detection is pattern-based and cannot guarantee catching every secret.
- Scam reports are stored in MongoDB. The form explains the stored fields; public case lookup returns only the case reference, status, and submission date. Submitting a report does not notify police, a bank, or a government agency.
- Configure AI and MongoDB credentials only on the backend.
- See [Security](docs/SECURITY.md), [API](docs/API.md), [AI workflow](docs/AI_WORKFLOW.md), and [database notes](docs/DATABASE.md).

## Current limitations

Production deployment and live MongoDB persistence have not been verified by this repository change. AI chat depends on a correctly configured provider; deterministic analysis and the safe fallback remain available when it is not configured. Features listed in the roadmap are not represented as complete.
