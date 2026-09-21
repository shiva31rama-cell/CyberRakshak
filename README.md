# CyberRakshak 2.0

CyberRakshak is an AI-powered, cybersecurity-focused safety platform for everyday users. It is designed to help people **ASK, SCAN, LEARN and GET HELP** when they face suspicious messages, online scams or other cyber-safety situations.

## Current product direction

```text
                    CYBERRAKSHAK
                         |
            +------------+------------+
            |            |            |
           ASK          SCAN         LEARN
            |            |            |
            +------------+------------+
                         |
                    UNDERSTAND
                         |
                      RESPOND
                         |
                     GET HELP
```

CyberRakshak is not intended to be a general-purpose chatbot. The assistant is constrained to cybersecurity and digital-safety topics and should redirect unrelated questions.

## Implemented in the current upgrade branch

- React + Vite product landing page rebuilt around cyber-safety tasks.
- Unified primary navigation around Scan, Learn, Get Help and Ask.
- Dedicated suspicious-message scanner at `/scan` and `/scan-message`.
- Shared backend message-analysis service with observable indicators and calibrated risk levels.
- Scanner API: `POST /api/scan/message`.
- Scanner rate limiting.
- Reusable cyber-relevance service for the assistant.
- Shared sensitive-input protection service.
- AI provider boundary so the chat controller no longer constructs the provider request directly.
- Existing grounded chatbot and incident-triage functionality preserved.
- Root development scripts now make `npm run dev` start the frontend and provide explicit frontend/backend scripts.
- CI is configured to check the upgrade branch family as well as the main development paths.
- Curated cyber-safety videos are integrated into the landing experience using the existing privacy-conscious YouTube embed component.

## Existing features preserved

- JWT/bcrypt authentication foundation
- MongoDB/Mongoose foundation
- Cyber-safety knowledge base
- Chatbot safety fallback and incident triage
- Learning modules
- Digital-literacy quiz
- Emergency help
- Scam reporting
- Feedback

## Technology

### Frontend
- React 19
- Vite 8
- React Router
- CSS

### Backend
- Node.js
- Express 5
- Mongoose
- MongoDB Atlas compatible configuration
- JWT
- bcryptjs
- Helmet
- CORS
- express-rate-limit

### AI
The backend uses an OpenAI-compatible chat-completions interface through an internal service boundary. The provider is configured only on the backend.

## Local setup

### 1. Install dependencies

```powershell
cd frontend
npm install

cd ..\backend
npm install
```

### 2. Configure the backend

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Set the required values in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=<your-mongodb-uri>
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_KEY=<server-side-key>
AI_MODEL=<model-name>
```

Never put `AI_API_KEY` in the Vite frontend environment.

### 3. Start the backend

```powershell
cd backend
npm run dev
```

### 4. Start the frontend

In a second terminal:

```powershell
cd frontend
npm run dev
```

Or from the repository root:

```powershell
npm run dev
```

The root `dev` script starts the frontend. Run `npm run backend` separately for the backend.

## API

### Health

`GET /health`

### Chat

`POST /api/chat`

Body:

```json
{
  "messages": [
    { "role": "user", "content": "I received a suspicious bank message." }
  ]
}
```

### Message scanner

`POST /api/scan/message`

Body:

```json
{
  "message": "Your bank account will be blocked today. Update KYC using this link."
}
```

The scanner returns a structured result containing cyber relevance, category, risk level, indicators, explanation and recommended actions.

## Important product boundaries

- Risk levels are based on observable indicators and are not proof of fraud.
- CyberRakshak must never request OTPs, passwords, PINs, CVVs, recovery codes or API keys.
- Official reporting/help resources must remain clearly distinguished from CyberRakshak guidance.
- Future capabilities such as RAG, vector search, threat-intelligence APIs, ML classification, voice, screenshot vision and mobile apps are **planned**, not claimed as complete.

## Documentation

- `docs/IMPLEMENTATION_AUDIT.md` — verified architecture and current foundation
- `docs/CURRENT_PROBLEMS.md` — problem/root-cause/fix/verification matrix
- `docs/AI_WORKFLOW.md` — assistant analysis pipeline
- `docs/API.md` — API contracts
- `docs/SECURITY.md` — security and privacy controls
- `docs/FUTURE_ROADMAP.md` — future work separated from current features

## Verification status

The upgrade branch has been implemented through the GitHub repository. Local runtime/build verification still needs to be performed on the developer machine with the real MongoDB and AI environment configuration. CI results should be checked after the branch workflow becomes available.
