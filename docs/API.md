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

The response can include intent, incident type, triage stage and grounded source metadata.

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

## Future API surfaces

These remain separate until implemented and tested:

- live social-platform evidence adapters
- RAG/vector search
- image/screenshot OCR/vision analysis
- analysis-history persistence
- advanced ML threat classification
- voice workflows
- native mobile client APIs
