# CyberRakshak 2.0 — UX + Android hardening stage

## Product experience

The Check Center is now designed as a decision workspace rather than a generic form. The flow is:

1. Choose the evidence type.
2. Paste/import only what the user wants checked.
3. Run the local-first analysis endpoint.
4. Review the risk decision and the evidence behind it.
5. Inspect matched threat intelligence and verified sources.
6. Move directly into Incident Mode when the result warrants recovery guidance.

## UX safeguards

- Clear privacy boundary beside the input.
- Explicit warning not to submit OTPs, PINs, CVVs, passwords or full card numbers.
- Clipboard import is user-triggered and optional.
- Clear action never persists the current input in application state after reset.
- Result panel exposes reasons, indicators, evidence and sources instead of presenting a score alone.
- Responsive layout works as a two-panel desktop workspace and a stacked mobile flow.
- English and Telugu copy is provided for the Check Center.

## Android boundary

The Android companion continues to classify notification title/text locally. It does not receive arbitrary photos, videos, contacts, message history or application storage. A structured `SafetyEvent` contract now exists for the local signal so a future explicit user-consent handoff can be implemented without silently uploading notification content.

## Build confidence

GitHub Actions now has a dedicated Android build workflow using JDK 17 and Gradle 8.13 to assemble the debug APK. This catches Android compilation regressions separately from the Node test suite.

## Next stage

The next implementation stage should add an explicit, consent-driven Android → Check Center handoff. The handoff should use an opaque event reference or user-initiated share flow rather than putting raw notification content into a URL. The web side should then show the source context, run the existing risk engine, correlate threat intelligence, and offer Incident Mode.
