# CyberRakshak Product Completeness Matrix

## Purpose

This document is the single source of truth for the complete CyberRakshak product scope. It prevents useful capabilities from being forgotten while keeping unfinished capabilities explicitly marked as planned rather than pretending they are production-ready.

## Core user journeys

| Area | Status | Capability |
|---|---|---|
| Home | Implemented | Simple entry points for learning, safety checking, emergency help, scam reporting and feedback |
| Safety Checker | Implemented | Analyze suspicious text and URLs with explainable risk signals |
| Learning | Implemented | Cyber-safety and digital-literacy learning modules |
| Quizzes | Implemented | Quiz flow, scoring and user results |
| Authentication | Implemented | Registration/login with JWT and role-aware access |
| Scam reporting | Implemented | Report scams and generate case numbers |
| Case tracking | Implemented | Privacy-limited case lookup |
| Feedback | Implemented | User feedback submission and admin review |
| Admin SOC | Implemented | Scam reports, analytics and feedback administration |
| AI assistant | Implemented | Defensive chatbot API with configurable provider and safe fallback |
| Emergency help | Implemented | Safety guidance and emergency resource navigation |
| Personalization | Implemented | Self-declared age group and language stored locally |
| India escalation guide | Implemented | Product guidance for official cybercrime, financial-fraud and telecom-safety channels |
| Privacy baseline | Implemented | Data minimization, secret handling, retention and AI-safety requirements documented |
| Accessibility baseline | Implemented | Keyboard, mobile, contrast, reduced-motion and plain-language acceptance checklist |

## Safety intelligence roadmap

| Capability | Status | Product requirement |
|---|---|---|
| Phishing detection | Implemented | Explainable URL/message indicators |
| UPI/payment fraud detection | Implemented | Payment-request warning signals |
| Fake-job scam detection | Implemented | Employment scam indicators |
| Digital-arrest impersonation detection | Implemented | Authority/urgency indicators |
| SIM/eSIM takeover awareness | Implemented | Telecom-risk guidance |
| Credential/OTP theft detection | Implemented | Credential and OTP request indicators |
| Screenshot/OCR analysis | Planned | Extract text from user-provided screenshots and analyze with privacy controls |
| Voice/call analysis | Planned | Consent-based analysis of user-provided call recordings; never automatic interception |
| Deepfake awareness | Planned | Defensive media authenticity assessment with uncertainty reporting |
| Live threat intelligence | Planned | Server-side feeds with provenance, caching and expiry |
| Custom ML classifier | Planned | Evaluated model trained only on legally usable data |
| Real-time alerts | Planned | WebSocket/event delivery for opted-in security events |
| Flutter mobile client | Planned | Reuse the same API/security contract |

## Realtime foundation

| Area | Status | Capability |
|---|---|---|
| Event envelope | Implemented | Versioned event IDs, timestamps, actors and derived data |
| Event safety rules | Implemented | No secrets; authorization and duplicate-tolerance requirements |
| Browser realtime delivery | Planned | WebSockets/Socket.IO or equivalent after backend/database migration |
| Durable event replay | Planned | Persisted event stream for audit/replay requirements |

## AI/ML safety requirements

1. Never expose API keys to the frontend.
2. Never execute, crawl or open URLs merely because a dataset labels them malicious.
3. Treat public security datasets as offline training/evaluation material.
4. Record dataset name, source URL, license, version/date and intended use before training.
5. Keep raw third-party datasets out of the application repository unless redistribution rights are verified.
6. Prefer extracted features, hashed/normalized indicators or curated samples when redistribution rights are unclear.
7. Report uncertainty instead of presenting a classifier score as certainty.
8. Keep deterministic safety rules as a fallback when an AI provider is unavailable.
9. Do not send unnecessary personal data to external AI providers.
10. Add rate limits, input-size limits and abuse controls to analysis endpoints.

## Data domains to support

- phishing URLs
- phishing email/text
- SMS/smishing
- OTP and financial-message intent
- scam/job-offer messages
- malicious/benign web-page features
- payment/UPI fraud language
- impersonation and urgency patterns
- multilingual cyber-safety examples
- safe educational question/answer material

## Data quality controls

Every training/evaluation source should be checked for:

- license and redistribution terms
- provenance
- duplicates
- label quality
- class imbalance
- language coverage
- temporal drift
- personally identifiable information
- malicious payloads or executable artifacts
- train/test contamination

## Production gates

A capability is considered production-ready only after:

- implementation is complete
- automated tests exist
- security review is complete
- failure behavior is defined
- privacy impact is considered
- rate limits are applied where appropriate
- CI passes
- deployment configuration is documented
- user-facing uncertainty/limitations are clear

## Release gate

Before merging a major upgrade to `main`, verify frontend lint/build, backend tests, dependency/security review, deployment configuration, API contracts, official-resource links, accessibility checks and all user-facing capability claims.

This matrix deliberately distinguishes implemented functionality from validated future work. That distinction is part of CyberRakshak's safety and engineering quality.
