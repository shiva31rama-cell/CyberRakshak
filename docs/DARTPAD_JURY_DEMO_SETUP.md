# DartPad jury preview — connection guide

## What the branch provides

The branch adds a compatibility layer to the existing Express backend for the Flutter/DartPad client:
- `GET /api/health`
- `POST /api/ai/assist` (reuses existing cyber-scoped chat controller)
- `POST /api/analyze` (existing deterministic message/URL analysis)
- `GET /api/public/media` and `GET /api/public/resources` (empty but correctly labelled live catalogues until publishing workflows exist)
- `GET /api/public/notices/verify/:id`
- `POST /api/incident-intake` (authenticated; transient reference only; narrative is not persisted)
- `POST /api/payment-instructions/compare` (authenticated; fictional synthetic record only)
- `GET /api/trust/organizations/:organizationId/notices` (tenant-scoped; requires verified org membership)
- `POST /api/trust/organizations/:organizationId/notices/:id/review` (approver role, distinct approver, signed publish)

## Start locally

From the repository:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
```

Edit backend/.env privately:
- Set `MONGODB_URI` to your own Atlas database.
- Set a new, long random `JWT_SECRET`.
- Set `PORT=5000`, `NODE_ENV=development`, `TRUST_PROXY_HOPS=0`.
- Set `FRONTEND_URL` to your exact DartPad browser origin, not an assumed domain.
- Configure AI provider URL/model/token only if you have a provider account. Otherwise, the assistant returns the labelled safety fallback.
- Configure notice signing keys only after generating and securely storing an Ed25519 key pair. Do not use demo/private keys for real institutional notices.

Start:
```powershell
npm start
```

Check:
```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

DartPad is hosted remotely: entering `http://localhost:5000` in its settings points at the DartPad user's own browser environment, not automatically at your PC. For a live jury demonstration, deploy the API to a publicly reachable HTTPS host or use a temporary HTTPS tunnel to your development server. Do not expose your PC without authentication and firewall awareness.

## DartPad configuration

More → Settings:
- Backend Base URL = the deployed HTTPS API base (no trailing slash required).
- Optional session access token = JWT from POST `/api/auth/login`.
- Save and test.

The UI's URL is the API origin, e.g. `https://your-api.example`, not an endpoint path.

## API test sequence

```powershell
$base = "https://YOUR-API"
Invoke-RestMethod "$base/api/health"
Invoke-RestMethod -Method Post "$base/api/analyze" -ContentType "application/json" -Body '{"type":"message","input":"Your account will be blocked. Verify now at a shortened link."}'
Invoke-RestMethod "$base/api/public/media"
```

AI endpoint requires POST JSON:
```json
{"message":"I received a suspicious payment request"}
``

Protected endpoints require:
```
Authorization: Bearer <JWT>
```

## CORS

Allow only the exact DartPad origin you observe in browser developer tools. Include your local React origin separately when testing locally. Do not use wildcard origin with credentials. If DartPad's origin cannot be stably allowlisted, use a separately hosted presentation frontend.

## Real limitations — do not hide these in the jury demo

- Message/URL analysis is deterministic heuristic analysis, not a calibrated probability or a definitive verdict.
- AI is live only when a server-side AI provider is configured; otherwise provider label/fallback is shown.
- Media/resources are genuinely live endpoints but return empty catalogues until publish/manage workflows are implemented.
- Incident intake currently returns a transient assistance reference and does not persist narrative or evidence.
- Payment comparison uses a fictional server-side record; it never initiates a payment.
- Campus notice signing requires an institution-verified organisation, correct membership roles and configured server-side signing keys. Existing trust feature code is an initial slice and still needs end-to-end tests, key registry/rotation, full atomicity and tenant-boundary review.
- File upload/download is not yet connected to persistent R2/object storage. Do not use Render ephemeral disk for important files. The DartPad picker is a browser file picker, not native phone-to-phone background transfer.
- A feature is only "live" if a request is accepted and its backend/persistence verification succeeds.

## Before the jury

1. Run backend unit tests and CI.
2. Test `/api/health`, AI fallback/provider, message scan, URL scan and notice lookup.
3. Test login and protected endpoints.
4. Test on the actual phone/browser and laptop on the same deployed HTTPS backend.
5. Disable network once to verify the UI says unavailable instead of reporting fake success.
6. Never use real personal documents, incident data, banking secrets or actual campus financial instructions in the demo.
