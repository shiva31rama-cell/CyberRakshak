# CyberRakshak Hosting Guide 🚀

## Recommended low-cost topology

```text
Render Static Site (React/Vite)
          │
          ▼
Render Web Service (Express API)
          │
          ├── MongoDB Atlas
          └── Optional OpenAI-compatible AI provider
```

This keeps the frontend and API separately deployable while allowing the project to start on free/low-cost tiers.

## Deploy from the repository

1. Connect the GitHub repository to Render.
2. Use the repository's `render.yaml` Blueprint.
3. Create/configure the MongoDB Atlas database.
4. Set the API service's `MONGODB_URI`.
5. Let Render generate `JWT_SECRET`, or provide a strong random secret.
6. Confirm `FRONTEND_URL` exactly matches the deployed frontend origin.
7. Configure `AI_API_URL`, `AI_API_KEY` and `AI_MODEL` only when an external AI provider is desired.
8. Verify the API health endpoint: `/health`.
9. Open the frontend and test navigation, checker, reporting, learning and chatbot flows.

## Environment rules

### API service

Required:

```text
MONGODB_URI
JWT_SECRET
FRONTEND_URL
```

Optional:

```text
AI_API_URL
AI_API_KEY
AI_MODEL
AI_SYSTEM_PROMPT
APP_PUBLIC_URL
```

### Frontend

Build-time variable:

```text
VITE_API_BASE_URL=https://<your-api-host>/api
```

Because Vite embeds `VITE_*` values during the build, the value must be correct when the static site is built.

## CI/CD gate

The repository workflow validates backend syntax/tests and frontend lint/build before the Render Blueprint's `checksPass` deployment trigger can be used as the deployment gate.

Do not treat a deployment as production-ready merely because the build succeeded. Verify the real database, CORS origin, authentication, report submission, admin operations and AI fallback/provider behavior in the deployed environment.

## Production checklist

- [ ] No `.env` files or provider keys committed
- [ ] MongoDB Atlas network access is configured appropriately
- [ ] Production JWT secret is long and random
- [ ] `FRONTEND_URL` is the exact production origin
- [ ] Frontend API URL points to the production API
- [ ] `/health` responds successfully
- [ ] Login/register work
- [ ] Safety Checker works
- [ ] Scam report submission returns a case number
- [ ] Case lookup exposes only non-sensitive case information
- [ ] Admin authentication and status updates work
- [ ] Feedback workflow works
- [ ] Chat works with provider and also falls back safely when provider is unavailable
- [ ] Mobile layout is checked on a real phone
- [ ] CI is green on the final commit
