# CyberRakshak 2.0 — Security Hardening Stage

This stage strengthens the safety boundary before additional integrations are added.

## Decision boundary

The deterministic risk engine remains authoritative for risk level and score. AI is an explanation layer only and must not override the deterministic decision.

## Evidence boundary

AI explanations receive only bounded deterministic evidence. Evidence fields are explicit: `matchedIndicators`, `matchedSignals`, and `sourceReferences`.

## Secret boundary

Repository CI includes a lightweight secret audit for common API-key, private-key, credential-like values, and frontend `VITE_*` secret names. The audit is a guardrail, not a replacement for GitHub secret scanning or key rotation.

## Privacy boundary

Notification monitoring remains local on Android until the user explicitly chooses a review/share flow. Raw notification text must never be placed into a URL or silently uploaded.

Multimodal cloud analysis should remain opt-in. Local validation and deterministic text analysis should work without cloud AI.

## Regression rule

Every new safety feature should add a unit test for the normal case, the suspicious case, and the privacy/security boundary where applicable.
