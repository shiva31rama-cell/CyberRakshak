# CyberRakshak Product Completeness Matrix

## Purpose

This is the product source of truth. Implemented capabilities are separated from planned capabilities so the project never claims unfinished technology as production-ready.

## Core user journeys

| Area | Status | Capability |
|---|---|---|
| Home | Implemented | Simple entry points into checking, learning, emergency help and reporting |
| Safety Checker | Implemented | Explainable message and URL risk analysis |
| Learning | Implemented | Visual learning center with focused modules and topic illustrations |
| Quizzes | Implemented | Scenario-based learning checks and results |
| Authentication | Implemented | Registration/login with role-aware access |
| Scam reporting | Implemented | Scam submission and case workflow |
| Case tracking | Implemented | Privacy-limited case lookup |
| Feedback | Implemented | User feedback workflow |
| Admin SOC | Implemented | Authorized administration of reports, analytics and feedback |
| AI Safety Copilot | Implemented | Multi-turn defensive assistant with guided tools, multilingual context, provider fallback and local conversation persistence |
| Emergency help | Implemented | Incident-response guidance |
| Personalization | Implemented | Self-declared preferences stored locally |
| Unified page template | Implemented | Shared page framing, title, purpose and accessibility entry point |
| Compact navigation | Implemented | Five primary actions with secondary features under More |
| India escalation guide | Implemented | Official-resource guidance layer |
| Privacy baseline | Implemented | Data minimization and AI/data safety rules |
| Accessibility baseline | Implemented | Mobile, keyboard, contrast, motion and plain-language checks |
| Maintenance automation | Implemented | Scheduled verification and failure issue reporting |
| Dependency update proposals | Implemented | Dependabot configuration for root/backend/frontend manifests |

## Education foundation

| Domain | Status | Current implementation |
|---|---|---|
| Digital literacy | Implemented | Dedicated lesson page + visual entry image |
| Password/account safety | Implemented | Dedicated lesson page + visual entry image |
| UPI/payment safety | Implemented | Dedicated lesson page + visual entry image |
| Social-media safety | Implemented | Dedicated lesson page + visual entry image |
| Phishing/smishing | Implemented | Cybercrime learning path + visual entry image |
| Device/app safety | Implemented | Visual learning path |
| AI/deepfake awareness | Planned | Visual expansion track; defensive and uncertainty-aware |
| Health/medical scam safety | Planned | Visual expansion track focused on verification and privacy |
| Human/online-abuse safety | Planned | Age-appropriate prevention, privacy and reporting guidance |
| Official video/media library | Implemented | Clearly labelled links to official awareness media |
| Screenshot-based visual lessons | Planned | Privacy-aware OCR/vision after security review |

## Safety intelligence roadmap

| Capability | Status | Product requirement |
|---|---|---|
| Phishing detection | Implemented | Explainable URL/message indicators |
| UPI/payment fraud detection | Implemented | Payment-request warning signals |
| Fake-job scam detection | Implemented | Employment scam indicators |
| Digital-arrest impersonation detection | Implemented | Authority/urgency indicators |
| SIM/eSIM takeover awareness | Implemented | Telecom-risk guidance |
| Credential/OTP theft detection | Implemented | Credential/OTP request indicators |
| Screenshot/OCR analysis | Planned | Privacy-aware extraction from user-provided screenshots |
| Voice/call analysis | Planned | Consent-based analysis of user-provided recordings |
| Deepfake awareness | Planned | Uncertainty-aware defensive media assessment |
| Live threat intelligence | Planned | Provenance, cache, expiry and abuse controls |
| Custom ML classifier | Planned | Evaluated model using legally usable data |
| Real-time alerts | Planned | Authorized event delivery for opted-in users |
| Flutter mobile client | Planned | Reuse the API/security contract |

## AI/ML safety requirements

1. Never expose API keys to the frontend.
2. Never execute, crawl or open URLs merely because a dataset labels them malicious.
3. Treat public datasets as offline material until a separate integration is reviewed.
4. Record provenance, license, version/date and intended use before training.
5. Keep raw third-party datasets out of the application repository unless redistribution rights are verified.
6. Report uncertainty and retain deterministic fallback behavior.
7. Minimize data sent to external AI providers.
8. Apply rate and input-size limits.
9. Treat model output as advisory; application code retains control over privileged actions.

## Production gates

A capability is production-ready only after implementation, automated tests, security review, privacy review, documented failure behavior, appropriate rate limits, passing CI, deployment verification and clear user-facing limitations.

## Current technology transition

The existing application uses MongoDB/Mongoose. PostgreSQL is the planned database target. Realtime delivery will follow the event contract after the database/backend migration is validated.
