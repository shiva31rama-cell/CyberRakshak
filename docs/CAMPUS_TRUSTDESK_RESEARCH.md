# CyberRakshak 3.0 — Campus TrustDesk
## Evidence-backed research and design decisions
**Research cut-off:** 11 November 2026  
**Status:** Research and design proposal. This document does not claim that proposed features are implemented or independently validated.

## 1. Product direction
Campus TrustDesk is a campus-focused trust and response workflow built on the existing CyberRakshak codebase. Its first differentiator is a registry of signed, versioned institutional notices that students and staff can verify against a canonical record. Supporting workflows include message/URL/QR triage, payment-instruction change control, and consent-based incident response.

This is a hypothesis to validate with students, faculty, placement staff, and finance/administration staff. It is not a claim of market uniqueness or guaranteed fraud reduction.

## 2. Evidence and implications
| Evidence | Source finding | Product implication | Boundary |
|---|---|---|---|
| RBI digital-payment safeguards discussion paper (9 Apr 2026) | Describes social engineering, coercion and impersonation risks in digital payments, including cases where users authorise the transfer themselves. | Add out-of-band verification and independent approval for changes to official campus payment instructions. | Discussion paper; not a college mandate or a bank integration. |
| MHA/PIB NCRP-CFCFRMS release (22 Jul 2026) | Reports 5,387,905+ cyber-fraud complaints and ₹56,087 crore+ reported for FY 2023-24 through FY 2025-26. | Use official context to motivate prevention and response workflows. | Complaint/reporting figures, not unique victims or a prediction of product impact. |
| NPCI fraud-awareness guidance | Warns QR scan + UPI PIN is for making a payment, not receiving one; lists QR and message/social-engineering fraud patterns. | Add QR destination preview and payment safety education. | Never collect UPI PIN, OTP or banking credentials. |
| NIST CSF 2.0 and NIST SP 800-61r3 | Organisational cyber risk functions and incident response are connected across governance, protection, detection, response and recovery. | Organise the project roadmap and incident workflow around recognised risk/response practices. | Framework mapping is not certification or compliance attestation. |
| OWASP Top 10:2025 | Highlights broken access control, misconfiguration, software supply-chain failures, cryptographic failures, injection, insecure design and authentication failures. | Prioritise tenant isolation, secure defaults, dependency hygiene and testable access controls. | A checklist does not prove the application is secure. |
| OWASP GenAI Top 10:2026 | Covers current LLM application risks including prompt injection, sensitive-data disclosure and excessive agency. | Keep AI advisory-only; never let model output publish notices or approve payment changes. | AI output must be validated and human reviewed. |
| Google Research CASE (2025) | Describes conversational collection of scam narratives and transformation into structured intelligence, with a Google Pay India deployment. | Use AI to help draft structured incident summaries from non-secret information. | Google-reported outcomes are not CyberRakshak results. |
| LegitPhish (2025) | Open dataset paper describes 101,219 labelled URLs and structural/lexical features. | Consider a reproducible, offline URL-analysis evaluation track. | Verify dataset access/licence and temporal leakage before claiming performance. |
| NASA Telemanom / NASA software catalogue | Open-source LSTM telemetry anomaly detection. | Optional research inspiration for anomaly detection on synthetic service telemetry. | Not a phishing detector and not a drop-in web security component. |
| ISRO/NESAC ISC²MIT-2026 (22–23 Oct 2026) | Seminar included cybersecurity, mission IT, AI and emerging technology. | Use as research context for cyber-resilience and mission-assurance trends. | Not evidence that ISRO endorses or uses this project. |
| MITRE ATT&CK | Public knowledge base of observed adversary tactics and techniques. | Map selected education/incident categories to ATT&CK for learning context. | Mapping is not detection coverage or attribution. |
| URLhaus Community API | Malware-URL intelligence with auth key and fair-use conditions. | Optional server-side reputation adapter after privacy, rate-limit and terms review. | Malware distribution focus; not all phishing pages. |

## 3. Competitor and adjacent-product comparison
- Truecaller Scam Checker: consumer-oriented scam, phone and URL checking. This means generic scanning is not a defensible centrepiece.
- Kerala Police Cyberwall: public digital-safety assistant with multiple input modalities and advertised checks. More input types alone are not a sufficient differentiator.
- Garud360: organisation awareness training and simulated phishing workflows. A generic training portal is not unique.
- Campus TrustDesk hypothesis: a trusted institutional source-of-truth for notices, QR verification, controlled payment-instruction changes and campus incident routing. Validate this gap with real campus users before claiming uniqueness.

## 4. Architecture recommendations
- Keep React/Vite and Express/Mongoose already present.
- Introduce Organisation and OrganisationMember before organisation-scoped features.
- Scope every organisation record by server-derived membership, never client-supplied role or organisation ID alone.
- Use Node.js crypto Ed25519 support for notice signatures; sign a canonical representation that includes notice ID, organisation, version, content digest, issuer, issue time and expiry.
- Keep private signing keys server-side in a managed secret store in deployment; include key ID/rotation metadata.
- QR codes should contain only an HTTPS verification URL and opaque public verification ID, never credentials or payment secrets.
- Published notice versions are immutable; corrections create a new version; revocation and expiry are explicit states.
- The public verification endpoint returns only fields intended for public release.
- A QR does not prove who sent a message. The UI must show the complete canonical notice so recipients can compare content.
- Payment instructions are reference/approval records only. Do not connect to banking rails or initiate payments.
- Persist incident data only with explicit consent, purpose, retention and deletion controls; raw scans/chat remain transient by default.
- AI can classify, explain and draft structured case details. It cannot publish, approve, assign permissions or mutate sensitive records.
- Do not fetch arbitrary URLs server-side; this creates SSRF/privacy risks. Reputation checks use approved provider adapters, safe timeouts, limits, attribution and opt-in rules.

## 5. Open-source candidates — reuse selectively
| Candidate | Proposed use | Caution |
|---|---|---|
| MISP | Later structured threat-intelligence interoperability | Do not self-host for the MVP; review AGPL-3.0 and deployment burden. |
| Wazuh | Optional monitoring of our own servers/endpoints | Broad SIEM/XDR platform; not required for student-facing workflow. Review licence. |
| URLhaus | Optional malware URL reputation | Requires API auth key and fair-use; commercial terms differ. |
| OWASP Cheat Sheets | Implementation reference | Guidance, not a library to paste wholesale. |
| MITRE ATT&CK | Threat education and taxonomy | Does not prove that CyberRakshak detects mapped techniques. |
| SpaceCOP CE | Research pattern for layered IDS/CTI | Aerospace/cFS application; do not port flight software into the web app. |
| Telemanom | Separate synthetic telemetry experiment | Requires its data/runtime; not a message/URL classifier. |
| TheHive | Incident workflow design reference | Product/licensing varies; not required for MVP. |

## 6. Security and evaluation gates
- Cross-organisation access tests for read/update/delete.
- Role escalation and missing/expired authentication tests.
- Notice signature tamper, unknown ID, expiry, revocation, supersession and copied-QR tests.
- Secret-detection tests prove that secret-bearing inputs are not forwarded to external AI.
- Malformed URL and private/local host tests; backend never fetches arbitrary destinations.
- Prompt-injection tests using untrusted notice/message content.
- Rate limit, safe logging, provider timeout/fallback and retention/deletion tests.
- Report precision/recall/F1 and false-positive rate per class for any ML detector; evaluate English, Telugu, Hindi and code-mixed inputs separately.
- Use synthetic notices, payment records, identities and incidents in public demos.

## 7. Primary sources and reading list
1. RBI, Discussion Paper — Exploring safeguards in digital payments to curb frauds, 9 Apr 2026: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23810
2. MHA/PIB, National Cybercrime Response Mechanism, 22 Jul 2026: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674
3. NPCI, Fraud Awareness: https://www.npci.org.in/fraud-awareness
4. NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
5. NIST SP 800-61 Rev. 3, 3 Apr 2025: https://csrc.nist.gov/pubs/sp/800/61/r3/final
6. OWASP Top 10:2025: https://top10.owasp.org/2025/
7. OWASP GenAI Security Project 2026 Top 10: https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/
8. Google Research, CASE (2025): https://research.google/pubs/case-an-agentic-ai-framework-for-enhancing-scam-intelligence-in-digital-payments/
9. LegitPhish, Data in Brief (2025): https://doi.org/10.1016/j.dib.2025.111972
10. NIST FIPS 186-5 Digital Signature Standard: https://csrc.nist.gov/pubs/fips/186-5/final
11. MITRE ATT&CK: https://attack.mitre.org/
12. URLhaus Community API: https://urlhaus.abuse.ch/api/
13. MISP: https://github.com/MISP/MISP
14. Wazuh: https://github.com/wazuh/wazuh
15. NASA Telemanom: https://github.com/khundman/telemanom
16. NASA software catalogue, NPO-50838-1: https://software.nasa.gov/software/NPO-50838-1
17. SpaceCOP Community Edition: https://github.com/the-aerospace-corporation/spacecop-ce
18. ISRO/NESAC ISC²MIT-2026: https://www.isro.gov.in/ISC2MIT2026.html
19. Truecaller Scam Checker announcement: https://corporate.truecaller.com/newsroom/press-release/truecaller-scam-checker-brings-together-scam-detection-and-community-intelligence?id=CF9222986F234D5B
20. Kerala Police Cyberwall: https://cyberwall.keralapolice.gov.in/
21. Garud360: https://www.garud360.com/
22. Discord account security: https://discord.com/safety/securing-your-discord-account
23. Carnegie Mellon SEI, incident-management history: https://www.sei.cmu.edu/history-of-innovation/fostering-growth-in-professional-cyber-incident-management/

## 8. Historical framing
The requested 1901–2026 span is historical context, not a claim that modern cyber defence existed for all 125 years. Useful milestones include Shannon's 1949 secrecy-systems paper, the 1988 Morris Worm and the growth of CERT/CC, OWASP's web security work, MITRE ATT&CK, NIST CSF 2.0, NIST SP 800-61r3 and current AI-security guidance. These developments support the progression from cryptographic integrity to incident response, application security, threat intelligence and safe AI-assisted workflows.

## 9. Scope guard
The first demonstrable vertical slice is: organisation admin creates a notice → authorised issuer publishes it → Ed25519 signature and QR are generated → public verifier retrieves canonical notice/status → altered, expired, revoked or unknown notices are not presented as current/valid. Only after that slice passes tests should we expand payment approval, incident case management and optional live feeds.

## 10. Evidence policy
A citation in this document supports the background statement only. It does not prove CyberRakshak effectiveness. Product claims must be supported by repository commits, automated tests, reproducible test data, pilot results and deployment evidence. Do not claim regulatory certification, institutional endorsement, government integration, bank integration or specific detection accuracy without evidence.
