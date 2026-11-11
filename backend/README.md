# Backend

The backend is a Node.js and Express API. It keeps HTTP routing, request handling, safety and domain services, and Mongoose models in separate modules so the same services can be reused without coupling them to Express routes.

## Run locally

From the repository root:

\`\`\`powershell
npm ci --prefix backend
Copy-Item backend/.env.example backend/.env
npm run backend
\`\`\`

Configure \`MONGODB_URI\` and a strong \`JWT_SECRET\` in \`backend/.env\`. AI settings are optional; keep provider keys on the server. The API listens on port 5000 by default. Set \`FRONTEND_URL\` when the frontend uses a different origin.

## Commands

Run these from the repository root:

\`\`\`powershell
npm test
npm run test:db
\`\`\`

The unit suite does not require a live database. The CRUD smoke test requires a separate \`MONGODB_TEST_URI\` in \`backend/.env\`; the target database name must include \`test\`. It uses synthetic data and deletes only the record it creates.

## Layout

- \`routes/\` — endpoint definitions
- \`controllers/\` — HTTP request/response handling
- \`services/\` — reusable AI, analysis, incident, safety, and verification logic
- \`models/\` — Mongoose schemas and persistence behavior
- \`middleware/\` — shared request middleware
- \`tests/\` — automated unit tests
- \`scripts/\` — opt-in database persistence smoke checks
- \`config/db.js\` — application database connection

The API surface and response contracts are documented in [the API reference](../docs/API.md). Security expectations are in [the security notes](../docs/SECURITY.md).
