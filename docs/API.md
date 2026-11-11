# CyberRakshak 2.0 API

Base URL during local development: http://localhost:5000/api

## Response contract

Success:

    { "success": true, "data": {} }

Failure:

    { "success": false, "message": "Unable to process request" }

## Authentication

- POST /auth/register
- POST /auth/login
- GET /auth/me — protected
- POST /auth/logout — protected

## Cyber assistant

POST /chat

Request:

    {
      "messages": [
        { "role": "user", "content": "I received a suspicious bank message." }
      ]
    }

The successful response contract is:

    {
      "success": true,
      "reply": "A bounded, non-empty assistant reply",
      "provider": "AI",
      "intent": "cyber_assistance",
      "incidentType": "phishing",
      "triageStage": "identify_assess",
      "sources": [
        { "label": "Official source label", "url": "https://official.example/" }
      ]
    }

`provider` is one of `AI`, `CyberRakshak safety fallback`, or `CyberRakshak scope guard`.
`intent` is one of `greeting`, `cyber_assistance`, or `non_cyber`.
`incidentType` is a supported incident category or `null`; `triageStage` is one of `general`, `identify_assess`, `contain`, or `recover_report`. Replies must be non-empty strings of at most 8,000 characters. Source entries must have a bounded label and a credential-free HTTPS URL.

The backend validates this structure before returning it. If the provider output or metadata is malformed, the controller returns a deterministic CyberRakshak safety fallback instead. Schema validation does **not** prove that natural-language model claims are true.

## Message scanner

POST /scan/message

The result contains category, riskLevel, confidence, indicators, sensitiveDataDetected, explanation, recommendedActions and evidenceStatus.

Current evidence status is heuristic-only. It is not proof of fraud.

## URL scanner

POST /scan/url

Request:

    { "url": "https://example.com/login" }

The result contains hostname, protocol, risk level, structural indicators, safer actions and evidenceStatus=STRUCTURAL_ONLY.

A clean result does not prove that a destination is safe.

## Incident Assistant

POST /incidents

Request:

    {
      "incidentType": "financial_fraud",
      "description": "Money was debited from my account."
    }

Supported guidance types include financial fraud, phishing, account compromise, device compromise, impersonation, privacy and general cyber incidents.

The response contains safe actions, evidence to preserve, information that must never be shared and official India help guidance.

## Social claim verification

POST /verify/social

Request:

    {
      "claim": "A post says this government scheme is guaranteed."
    }

The current implementation is a structured triage layer and does not claim real-time social-platform browsing.

Core rule:

**Unverified ≠ False**

The response includes an official-source registry and recommended independent verification steps.

## Health

GET /health

Returns basic API health. Full backend startup still requires a configured MONGODB_URI because the current server intentionally fails fast when MongoDB cannot be configured or reached.

## Security rules

- Request bodies are bounded.
- API rate limits are applied to sensitive endpoints.
- Helmet and CORS are enabled.
- Authentication secrets are server-side only.
- The application must never ask users to submit passwords, OTPs, PINs, CVVs, recovery codes or API keys.

## Scam reports

- `POST /scam-report` creates a report and returns a random case reference.
- `GET /scam-report/case/{caseNumber}` returns only the case reference, status and submission date.
- `DELETE /scam-report/case/{caseNumber}` deletes the active report record. The case reference is a bearer token: anyone who has it can view status or request deletion. The response does not return report details.
- `GET /scam-report?page=1&limit=20` is administrator-only and returns a paginated report list. The limit is capped at 100.
- `GET /scam-report/user/{userId}?page=1&limit=20` requires authentication and allows the report owner or an administrator.
- `PATCH /scam-report/{id}` is administrator-only. Supported statuses are `new`, `under-investigation`, `resolved` and `closed`.

Deletion removes the report from active application records. Backup retention depends on the configured MongoDB hosting policy and must be reviewed before production.

## Future API surfaces

These remain separate until implemented and tested:

- live social-platform evidence adapters
- RAG/vector search
- image/screenshot OCR/vision analysis
- analysis-history persistence
- advanced ML threat classification
- voice workflows
- native mobile client APIs
