# CyberRakshak API

Express + Mongoose backend for the CyberRakshak safety portal.

## Run locally

```bash
npm ci
cp .env.example .env
npm run dev
```

Default port: `5000`.

Health endpoint: `GET /health`

## API areas

- `/api/auth` — registration, login and current-user authentication
- `/api/quiz` — quiz content and results
- `/api/feedback` — user feedback and protected admin management
- `/api/scam-report` — public submission/case lookup plus protected user/admin operations
- `/api/chat` — optional AI assistant with defensive local fallback

## Production requirements

The server requires `MONGODB_URI` and `JWT_SECRET`. AI provider variables are optional; without a valid provider configuration, the chat endpoint returns built-in safety guidance instead of failing the application.

`FRONTEND_URL` controls CORS and can contain comma-separated allowed origins.

The API applies rate limiting to authentication and chat endpoints, uses Helmet security headers, disables the Express fingerprint header, limits request body size, and validates protected admin actions through JWT middleware.
