# Frontend

The frontend is a React application built with Vite. Pages compose shared components and call the backend through the API client in \`src/services/api.js\`.

## Run locally

From the repository root:

\`\`\`powershell
npm ci --prefix frontend
Copy-Item frontend/.env.example frontend/.env
npm run dev
\`\`\`

Vite starts on port 5173. Set \`VITE_API_BASE_URL\` in \`frontend/.env\` if the backend API is not at \`http://localhost:5000/api\`. Do not put server secrets or database credentials in frontend environment variables; Vite exposes \`VITE_*\` values to the browser.

## Checks

\`\`\`powershell
npm run lint
npm run build
\`\`\`

## Layout

- \`src/pages/\` — route-level screens
- \`src/components/\` — reusable interface components
- \`src/contexts/\` — shared client state
- \`src/services/\` — API calls and domain-specific client helpers
- \`public/\` — static assets and the offline application shell
