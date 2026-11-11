# Campus TrustDesk — scope and decisions
1. One campus first; multi-campus later.
2. Core differentiator: signed/versioned campus notice registry with QR verification and explicit revocation/expiry.
3. Supporting modules: current message/URL scanners, payment-instruction change control, incident desk and multilingual awareness.
4. AI advisory only; no publishing, payment approval or other sensitive mutation via model output.
5. No payment execution, bank APIs, automatic government reporting or scraping of messaging/streaming platforms.
6. QR never proves the sender; always show the canonical signed notice and compare content.
7. No blockchain in MVP; Ed25519 signatures + controlled key storage + immutable versions + audit log are simpler and testable.
8. Raw scan/chat data transient by default; incident persistence is explicit and consent-based with retention and deletion.
9. Use synthetic data for public demos.
10. Evaluate with tamper/expiry/revocation/tenant-isolation tests and publish real results only.
11. Do not claim institutional endorsement, regulatory compliance, government integration or measured fraud reduction without evidence.
