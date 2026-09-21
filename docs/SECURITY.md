# CyberRakshak Security and Privacy

## Current controls

- Helmet security headers
- Environment-based CORS origin
- JSON/form request size limits
- Authentication rate limiting
- Chat rate limiting
- Scanner rate limiting
- JWT/bcrypt authentication foundation
- Backend-only AI credentials
- Shared sensitive-input detection for the assistant
- Fail-safe AI provider fallback
- Centralized Express error response

## Sensitive information

CyberRakshak must never ask users to submit:

- OTPs
- UPI PINs
- card PINs
- CVVs/CVCs
- passwords
- recovery codes
- API keys
- authentication tokens

Technical logs should not contain these values or raw sensitive incident details.

## Environment variables

`.env` files are ignored by Git and `.env.example` files contain placeholders only. AI keys must never be placed in Vite frontend environment variables.

## File uploads

Screenshot/image analysis is not represented as implemented yet. Before enabling it, the backend must enforce MIME validation, extension checks, size limits, processing timeouts and temporary-storage cleanup.

## Risk communication

Risk levels describe observable indicators and should not be presented as legal or forensic confirmation. The product must distinguish suspicious, potentially fraudulent and confirmed information when evidence supports the distinction.

## Future review items

- Secure token-storage strategy documentation
- Analysis-history deletion/privacy controls
- URL-scanner threat-intelligence verification
- Image-processing isolation
- Dependency vulnerability review
- Production CORS origin verification
- Audit logging without sensitive payloads
