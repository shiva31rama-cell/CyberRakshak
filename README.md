# CyberRakshak — Cyber Awareness & Protection Platform

CyberRakshak is a bilingual (English / తెలుగు) cybersecurity awareness platform for students, professionals, senior citizens and everyday internet users in India.

## Features

| Feature | Status |
|---|---|
| **Cyber threat library**: what it is, how it works, targeting, illustrative scenario, warning signs, identification, prevention, victim steps | 10 core topics in English + Telugu (phishing, UPI fraud, OTP scams, QR scams, fake jobs, investment scams, social engineering, ransomware, password attacks, identity theft). The remaining 15 topics from the roadmap are not yet written. |
| **Suspicious Message Analyser** | Transparent **rule-based** engine (not an AI model) with 15 indicator rules and URL inspection. Gives 5 classifications and 4 risk levels, explains every flag and states its limitations. |
| **Cyber Awareness Videos** | 28 YouTube videos (CyberDost I4C, Cyberabad / Hyderabad / Vizag police, Telangana Cyber Security Bureau, AP Mahila Police, IBM, Kaspersky, BBC Ideas and others), including Telugu videos. Every video ID was checked against YouTube's oEmbed endpoint. Videos never autoplay and use the privacy-enhanced embed. |
| **Random quiz** | 24 bilingual questions (8 per level), with options shuffled, no repeats, instant explanations, score, performance band and weak-topic recommendations. 15/20-question quizzes are topped up from other levels. |
| **Safety Guide** | Official resources: cybercrime.gov.in, the 1930 helpline and CERT-In. Covers reporting steps, evidence to keep and what never to share. |
| **Bilingual UI** | A central translation system with an English \| తెలుగు switch that is saved in `localStorage`. Uses the Noto Sans Telugu font. |
| Existing features kept | Login/register (JWT + MongoDB), feedback, scam reports, MongoDB-backed quiz API, chatbot |

## Architecture

```
shared/                     # Plain ES modules used by BOTH frontend and backend
  analyzer/messageAnalyzer.mjs   # rule engine: sanitize → rules → URL inspection → classify
  content/threats.mjs            # bilingual threat library
  content/quiz.mjs               # bilingual quiz bank + buildQuiz()
  content/videos.mjs             # verified video list
backend/   Express 5 + MongoDB (Mongoose). Node ≥ 22.12 (uses require() of ES modules)
frontend/  React 19 + Vite + React Router
```

The analyser calls `POST /api/analyze` when `VITE_API_BASE_URL` is configured. If the server can't be reached, it runs the same engine in the browser, and the result page says which one was used. Messages are never stored.

To add a trained ML model later, pass `analyzeMessage(text, { classifier })`. The classifier's output goes in `result.model`. No confidence score is shown unless a real model supplies one.

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/analyze` | `{ message }` → classification, level, rule score, indicators, URLs. 1–5000 chars. Rate limited to 30 requests per 10 minutes per IP (`ANALYZE_RATE_LIMIT`). |
| GET | `/api/content/threats?q=` | Threat library |
| GET | `/api/content/threats/:slug` | One topic |
| GET | `/api/content/videos?lang=en\|te&category=` | Videos |
| GET | `/api/content/quiz?difficulty=&count=5\|10\|15\|20` | Random quiz, answers removed |
| POST | `/api/content/quiz/grade` | `{ answers: [{ id, option }] }` → score |
| — | `/api/auth`, `/api/quiz`, `/api/feedback`, `/api/scam-report`, `/api/chat` | Existing APIs (unchanged) |

## Setup

```bash
# backend
cd backend && cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, FRONTEND_URL
npm install && npm run dev           # http://localhost:5000

# frontend
cd frontend && cp .env.example .env  # VITE_API_BASE_URL=http://localhost:5000/api
npm install && npm run dev           # http://localhost:5173
```

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL` (CORS origin) | backend | Existing |
| `AI_API_KEY`, `AI_API_URL`, `AI_MODEL` | backend | Optional chatbot provider (server-side only) |
| `ANALYZE_RATE_LIMIT` | backend | Analyse requests per 10 min per IP (default 30) |
| `VITE_API_BASE_URL` | frontend | Backend URL. **Required in production**; there is no localhost fallback in production builds. |
| `VITE_BASE` | frontend build | Base path, e.g. `/CyberRakshak/` for GitHub Pages |

## Deployment

- **Frontend** (Vercel / Netlify / GitHub Pages): run `npm run build` in `frontend/` and serve `frontend/dist`. Set `VITE_API_BASE_URL`. For GitHub Pages also set `VITE_BASE=/CyberRakshak/` and copy `index.html` to `404.html` so client-side routes work. The threat library, analyser, quiz and videos all work with no backend.
- **Backend** (Render / Railway): use the repo root as the source, because the backend needs `../shared`. Start with `cd backend && npm install && npm start`. Set `FRONTEND_URL` to the deployed frontend origin. Needs a MongoDB Atlas URI.

## Testing

```bash
cd backend && npm test      # analyser (10 message types), validation, quiz integrity, chatbot
cd frontend && npm run lint && npm run build
```

Known issue: 2 of the existing chatbot tests (`tests/chatController.test.js`) fail on the original `main` too. They expect older reply wording.

## Security & privacy

Inputs are validated and size-limited (100 kb body, 5000-char messages). Analysis has its own rate limit. Helmet headers are on, CORS is restricted, and 5xx responses use generic error messages. React escapes all output. Links in analysed messages are shown as text and never opened. Video IDs are checked against a strict pattern before embedding. Messages are not stored or logged, and API keys stay on the server.

## Disclaimer

CyberRakshak is an independent educational resource and not a government service. To report cybercrime in India use **https://cybercrime.gov.in/** or call **1930**. Telugu content should be reviewed by a native speaker before public launch.
