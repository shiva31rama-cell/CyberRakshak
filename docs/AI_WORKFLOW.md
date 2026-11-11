# CyberRakshak AI Workflow

## Current flow

```text
User input
   ↓
Input validation
   ↓
Cyber relevance classification
   ↓
Incident/category detection
   ↓
Knowledge grounding
   ↓
AI provider service
   ↓
Safe fallback on provider failure
   ↓
User-facing guidance
```

The message scanner currently uses a deterministic indicator-based analysis service. The chat assistant additionally uses the grounded knowledge base and an AI provider when configured.

## Cyber relevance

The reusable relevance service distinguishes:

- greeting
- cyber assistance
- non-cyber

Clearly unrelated requests are redirected instead of being sent to the AI provider.

## Incident triage

The assistant preserves the existing progressive incident flow:

```text
IDENTIFY
   ↓
ASSESS IMPACT
   ↓
CONTAIN
   ↓
RECOVER / REPORT
   ↓
PREVENT
```

The assistant should ask only the highest-value missing questions and must never request authentication secrets.

## Grounding

Topic-specific facts, immediate actions, avoid-list items and sources are loaded from `backend/data/cyberKnowledge.js` before the provider request. Sources must come from the application knowledge base or verified official resources; the system must not invent citations.

## Output contract validation

Every response from `POST /api/chat` is validated against a backend-owned contract before it is returned. The validator checks the reply's type and length, the provider/intent/incident/triage enums, and the structure of curated source metadata. Source URLs must be credential-free HTTPS URLs.

Malformed provider output is never returned as a successful AI reply; the controller attempts a deterministic safe fallback and has a minimal final guard. Contract validation verifies shape and metadata constraints only—it cannot establish that a model's prose is truthful. Grounding, cautious language, and provider-failure fallback remain necessary.

## Provider boundary

The chat controller now calls:

```text
controller → aiService → provider adapter → AI API
```

This makes provider changes possible without moving provider-specific HTTP code into controllers.

## Scanner workflow

```text
Message
  ↓
Validation
  ↓
Observable indicator extraction
  ↓
Category classification
  ↓
Risk calculation
  ↓
Recommended actions
```

The scanner explicitly states that indicators are not proof of fraud.

## Future workflow

Future RAG, ML, threat intelligence, OCR/vision and voice capabilities must plug into services without replacing the core safety boundary. They are not considered implemented until real code and verification exist.
