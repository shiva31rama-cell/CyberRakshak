# CYBPRO Web + Mobile Architecture

## Product shape
CYBPRO is one product delivered through:
- Web application: React + TypeScript + Vite.
- Mobile application: React Native + Expo + TypeScript (Android and iOS).
- Shared backend: Fastify + TypeScript API and common analysis contracts.
- Shared analysis service: Python-based model/media adapters in later slices.
- Shared product rules: evidence provenance, risk/confidence separation, privacy defaults, safe incident guidance.

## Client parity
Both clients should use the same API endpoints and display the same report fields. Feature parity is an acceptance goal, but each client may use platform-native input controls.

## Mobile input plan
- Text paste and typed content in Phase 1.
- URL entry in Phase 1.
- Image/camera and selected documents after safe upload API and validation are implemented.
- Audio recording/file import and video selection only after duration, size, format, and processing limits are implemented.
- Text-to-speech and speech-to-text only after language quality, user consent, and local/provider data handling are documented.

## Local development
From the cybpro directory:
- pnpm install
- pnpm --filter @cybpro/api dev
- pnpm --filter @cybpro/web dev
- pnpm --filter @cybpro/mobile start

For a physical phone, set EXPO_PUBLIC_API_BASE_URL to the development computer's LAN IP, not localhost. Localhost on the phone means the phone itself. Use a trusted network and never expose a development API directly to the public internet.

## Production checklist
- HTTPS-only API.
- Separate dev/staging/production configuration.
- Authentication only where needed; no forced account for basic scan.
- Mobile privacy disclosures and permissions at point of use.
- Upload allowlist, actual file signature validation, size/time limits, isolated parsers, cleanup, and no execution of uploaded content.
- Store secrets only on the server or a managed secret service.
- Verify app signing, privacy disclosures, accessibility, offline/error states, and store requirements before release.
