# CYBPRO: Competitor and Open-Source Research Baseline

Research snapshot: 2026-10-10. Verify product terms, service availability, and API policies again before release.

## Competitor / adjacent-product landscape
- Google Safe Browsing / Web Risk: URL and web-threat reputation services. Their intended usage and commercial terms differ; do not assume the non-commercial Safe Browsing API is suitable for a commercial product.
- Microsoft Defender SmartScreen: browser/Windows protection against phishing and malicious sites.
- VirusTotal: multi-engine URL/file reputation. Public API has strict quotas and restrictions; do not build production dependence on its public API.
- Consumer scam assistants and browser security products: compete on ease of use, detection, explanation, and incident guidance.
- urlscan.io and similar URL-analysis services: useful for research and public-URL investigation, but submissions may be publicly visible depending on options and terms; do not upload private user content without understanding the policy.
- PhishTank and URLhaus: community threat-intelligence sources with their own rate limits, data coverage, and usage terms.
- MISP and OpenCTI: threat-intelligence sharing/management platforms, more suitable for structured intelligence workflows than as a ready-made end-user scam assistant.

## CYBPRO's intended differentiation
1. A single explainable flow for text, URL, image, audio, video, and selected documents.
2. Evidence provenance and freshness, not just a verdict.
3. Risk and confidence shown separately; unknown/conflicting results are first-class.
4. Actionable, localized response guidance for Indian digital-payment and impersonation scams.
5. Privacy by default, safe file handling, transparent source limitations.
6. Public, reproducible evaluation that includes false positives and difficult benign cases.
7. Optional quantum research reported honestly against classical baselines.

These are hypotheses to validate, not claims that competitors lack these features. Competitor research should be refreshed with direct product testing, current terms, user interviews, and an honest feature matrix.

## Primary references
- Qwen2.5-Omni repository: https://github.com/QwenLM/Qwen2.5-Omni
- Ollama local API documentation: https://github.com/ollama/ollama/blob/main/docs/api/introduction.mdx
- Ollama pricing / local inference distinction: https://www.ollama.com/pricing
- PhishTank API information: https://phishtank.org/api_info.php
- URLhaus API: https://urlhaus.abuse.ch/api/
- MISP: https://github.com/MISP/MISP
- OpenCTI: https://github.com/OpenCTI-Platform/opencti
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework

## Research cautions
- Check the exact licence for every model checkpoint and software dependency.
- Check API terms, attribution rules, request limits, commercial restrictions, and privacy implications.
- Never describe a source as unlimited unless its published terms actually support that claim.
- Never invent competitor test results or CYBPRO benchmark metrics.
