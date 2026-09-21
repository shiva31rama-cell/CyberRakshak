# CyberRakshak API

Base URL during local development: `http://localhost:5000/api`

## Standard response

Success:

```json
{ "success": true, "data": {} }
```

Failure:

```json
{ "success": false, "message": "Unable to process request" }
```

## Authentication

Existing authentication endpoints remain under `/api/auth`.

- `POST /api/auth/register`
- `POST /api/auth/login`

Protected requests use the existing Bearer-token mechanism where required.

## Cyber assistant

`POST /api/chat`

Request:

```json
{
  "messages": [
    { "role": "user", "content": "I received a suspicious bank message." }
  ]
}
```

The response includes the assistant reply plus structured metadata such as intent, incident type, triage stage and grounded sources.

## Message scanner

`POST /api/scan/message`

Request:

```json
{
  "message": "Your account will be blocked today. Update KYC using this link."
}
```

Current result shape:

```json
{
  "success": true,
  "message": "Message analysis completed",
  "data": {
    "isCyberRelated": true,
    "category": "phishing",
    "riskLevel": "HIGH",
    "confidence": 0.85,
    "indicators": ["Contains a link or URL", "Urgency or pressure"],
    "explanation": "...",
    "recommendedActions": ["..."],
    "shouldReport": true,
    "language": "en",
    "sources": [],
    "analysisMethod": "CyberRakshak heuristic analysis"
  }
}
```

The risk result is an indicator-based assessment and must not be described as confirmed fraud without independent evidence.

## Health

`GET /health`

Returns a basic API health response. Database availability is still determined during backend startup because the current server intentionally fails fast when `MONGODB_URI` is missing or the database connection cannot be established.

## Existing APIs

The existing application also exposes quiz, feedback and scam-report routes. These are preserved while the platform is being unified.

## Future API surfaces

The following are planned and should not be treated as implemented until real endpoints exist:

- URL scanning
- image/screenshot analysis
- incident records/history
- analysis history
- admin content management
- threat-intelligence adapters
