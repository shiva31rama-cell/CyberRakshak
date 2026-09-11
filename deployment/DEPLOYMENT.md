# CyberRakshak Deployment Guide

## Recommended production stack

CyberRakshak uses MongoDB/Mongoose already, so the simplest production setup is:

- **Database:** MongoDB Atlas
- **Backend:** Render Web Service
- **Frontend:** Render Static Site
- **Source/CI:** GitHub

This keeps the application on one deployment platform while Atlas provides managed MongoDB persistence, backups, authentication, and network controls.

## 1. MongoDB Atlas

Create a MongoDB Atlas project and a production cluster/database. Create a database user with a strong password and copy the application connection string.

Use the connection string as the backend `MONGODB_URI` environment variable. Never commit it to Git.

For production, configure Atlas Network Access so that only the required deployment egress is allowed. If the deployment provider uses dynamic outbound IPs, use the provider's documented secure connectivity option rather than permanently opening the database to the world unless this is an intentional temporary demo configuration.

## 2. Render backend

Create the services from the repository's `render.yaml` Blueprint, or create a Render Web Service manually:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check: `/health`

Required environment variables:

- `NODE_ENV=production`
- `MONGODB_URI=<Atlas connection string>`
- `JWT_SECRET=<strong random secret>`
- `FRONTEND_URL=<deployed frontend origin>`
- `PORT` may be supplied by Render; the application also supports the platform-provided value.

Optional AI variables:

- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL`

If the AI variables are not configured, the application uses its defensive local fallback instead of pretending that a remote AI service is connected.

## 3. Render frontend

Create a Render Static Site:

- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Set:

- `VITE_API_BASE_URL=https://<your-backend-domain>/api`

The Blueprint includes a SPA rewrite so React Router routes continue to work after direct navigation or refresh.

## 4. Configure the two origins

After both services have URLs:

1. Set backend `FRONTEND_URL` to the exact frontend origin, without a trailing slash.
2. Set frontend `VITE_API_BASE_URL` to the backend origin plus `/api`.
3. Redeploy the frontend after changing its Vite environment variable because Vite injects `VITE_*` values during the build.
4. Confirm `GET /health` returns a successful response.

## 5. Production smoke test

Test these flows against the deployed system:

1. Open the frontend home page.
2. Register a new user.
3. Log in and refresh the page.
4. Load learning content and quizzes.
5. Submit a quiz and verify the result is persisted.
6. Submit feedback and verify the admin view can retrieve it.
7. Submit a scam report and record the generated case number.
8. Track the case using the public case-tracking flow.
9. Log in as an admin and verify report, analytics, and feedback management.
10. Open the chatbot and verify it returns either a configured provider response or the defensive fallback.
11. Confirm invalid/unauthorized API requests return appropriate errors.
12. Confirm the browser network panel shows the deployed API rather than localhost.

## Security checklist

- Do not commit `.env` files or credentials.
- Use a unique production `JWT_SECRET`.
- Keep CORS restricted to the deployed frontend origin.
- Keep MongoDB authentication enabled.
- Prefer restricted Atlas network access.
- Do not expose reporter private information through public case tracking.
- Rotate leaked or previously committed credentials immediately.
- Review Render and Atlas logs after the first deployment.

## Rollback

Use Render's previous successful deployment for application rollback. Keep MongoDB schema changes backward-compatible so an application rollback does not corrupt or strand production data.
