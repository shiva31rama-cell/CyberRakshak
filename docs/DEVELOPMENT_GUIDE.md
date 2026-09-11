# CyberRakshak Development Guide

This guide is the practical reference for making changes without losing track of the project.

## 1. Before changing anything

```bash
git checkout main
git pull origin main
git checkout -b feat/my-change
```

For work that belongs to an existing feature branch, start from that branch instead of duplicating work.

## 2. Understand the structure

- `frontend/` — pages, reusable components and API service.
- `backend/` — Express server, routes, controllers, models and safety logic.
- `database/` — schema/migration material.
- `docs/` — product, UX, privacy, data and operations documentation.
- `ml/` — offline ML research foundation.
- `.github/workflows/` — continuous checks and maintenance automation.

## 3. UI change workflow

Keep every route focused on one primary task. Use the shared `PageShell` for page framing. Put secondary links in contextual areas or the `More` navigation rather than adding another row of global buttons.

Preferred flow:

`Page title → purpose → primary task → result/status → next safe action`

Read `docs/UI_UX_SYSTEM.md` before adding new screens.

## 4. Backend change workflow

For a new endpoint:

1. Define the request/response contract.
2. Validate input size and shape.
3. Apply authentication/authorization where required.
4. Add rate limiting for abuse-prone routes.
5. Keep sensitive values out of logs.
6. Add automated tests.
7. Update documentation.

Never move security decisions into frontend-only checks. Frontend role visibility is for usability; the backend remains authoritative.

## 5. Run the checks

```bash
cd backend
npm install
npm test
node -c server.js

cd ../frontend
npm install
npm run lint
npm run build
```

## 6. Common problems

### Frontend build fails with CSS parsing errors

Check the last edited CSS file for missing braces, invalid nesting and stray declarations. Run:

```bash
npm run build
```

### API requests point to localhost after deployment

Verify `VITE_API_BASE_URL` in the frontend deployment environment and rebuild the frontend.

### Backend starts but cannot connect to the database

Check the backend environment variables and database reachability. Never paste the database password into source control or an issue.

### Authentication appears stale in the browser

Use the normal logout/login flow and verify `authService` storage behavior. The Navbar listens for the application's `cyberrakshak:auth-changed` event.

### CI fails but local checks pass

First compare Node versions and environment variables. CI is intentionally the release gate; do not bypass a failing check without understanding it.

## 7. Database migration rule

The application currently uses MongoDB/Mongoose. PostgreSQL is the target architecture. Do not partially switch models and controllers in the same change unless the migration plan explicitly supports both paths.

Recommended migration order:

`schema → connection layer → models/repositories → routes/controllers → tests → deployment → removal of MongoDB code`

## 8. Realtime rule

Realtime should be introduced through the event contract in `docs/REALTIME_EVENT_CONTRACT.md`. Keep browser delivery, authorization and durable persistence separate concerns.

## 9. ML rule

Use `ml/README.md` and `docs/DATASET_CATALOG.md`. Datasets are offline training/evaluation material unless a feed has an explicit, reviewed integration design. Never execute or crawl suspicious URLs as part of ordinary model development.

## 10. Pull request checklist

- [ ] Feature is scoped to one clear user outcome.
- [ ] UI uses the shared visual hierarchy.
- [ ] No unnecessary global navigation button was added.
- [ ] Backend validation/rate limits are appropriate.
- [ ] No secrets were committed.
- [ ] Tests pass.
- [ ] Frontend lint/build pass.
- [ ] Docs reflect the new behavior.
- [ ] Implemented vs planned status is accurate.

## 11. Safe automation

GitHub Actions should automatically run repeatable checks and surface failures. Dependency tools may propose updates. Security-sensitive source code should not be auto-rewritten blindly.

The goal is **less manual remembering, not less engineering review**.
