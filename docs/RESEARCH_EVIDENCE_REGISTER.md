# CyberRakshak 3.0 — Research Evidence Register

**Cut-off:** 11 November 2026  
**Purpose:** Keep presentation claims traceable to sources and separate observed facts from design proposals.

## Evidence register

| ID | Source and date | Source type | Supported point | CyberRakshak implication | Limitation |
|---|---|---|---|---|---|
| E01 | RBI, Discussion Paper — Exploring safeguards in digital payments to curb frauds, 9 Apr 2026 | Primary government/regulator | RBI discusses safeguards against digital-payment fraud and social-engineering risks | Payment instructions need verification workflows, not only URL checks | Discussion paper, not final college regulation |
| E02 | MHA/PIB, National Cybercrime Response Mechanism, 22 Jul 2026 | Primary government | NCRP/CFCFRMS reports 5,387,905+ complaints across FY2023-24 to FY2025-26 and ₹56,087 crore+ reported | Establishes national problem context | Complaint totals are not unique victims; do not infer campus prevalence |
| E03 | Google Research, CASE, 2025 | Research paper | Describes conversational scam elucidation and extraction of structured intelligence | AI can help structure an incident interview for human review | Google's reported 21% enforcement uplift belongs to Google's deployment only |
| E04 | NIST SP 800-61 Rev.3, 3 Apr 2025 | Government standard/guidance | Integrates incident response with CSF 2.0 risk management | Structure incident workflows and recovery | Guidance, not certification |
| E05 | OWASP Top 10:2025 | Community security standard | Lists major web app risks including broken access control and cryptographic failures | Prioritise tenant isolation, auth, crypto and secure configuration | Awareness document, not penetration-test result |
| E06 | OWASP GenAI LLM Top 10:2026, 4 Aug 2026 | Community security standard | Highlights prompt injection, sensitive information disclosure, excessive agency and misinformation | Treat AI inputs as untrusted; AI cannot approve/publish | Does not mean app is OWASP compliant |
| E07 | NPCI Fraud Awareness | Primary industry/rail operator guidance | Warns that scanning QR and entering UPI PIN is for making a payment, not receiving one | Add QR/payment safety language | Does not verify any particular QR |
| E08 | Truecaller Scam Checker launch, 28 Sep 2026 | Company release | Offers link, number, message checks and community intelligence | Generic message/link scanner is not unique | Company description, not independent comparative evaluation |
| E09 | Kerala Police Cyberwall | Official police service | Describes multimodal digital-safety assistant and numerous checks | Avoid feature-count competition | Published feature descriptions are not an independent accuracy audit |
| E10 | Garud360 product pages | Vendor product description | Lists org roles, training, simulated phishing and employee reporting | Generic awareness LMS is not sufficient differentiation | Vendor claims/pricing may change |
| E11 | MongoDB Atlas multi-tenant architecture documentation | Technical vendor docs | Explains tenant-isolation architecture choices and application-layer segmentation | Use tenantId/organizationId with mandatory server filters and tests | Implementation responsibility remains with app developer |
| E12 | ISRO/DoS ISC²MIT-2026, held 22–23 Oct 2026; announcement 28 Oct 2026 | Official space-sector event | Seminar themes included computing, cyber security, Mission IT, AI and emerging technology | Research context for resilience and mission assurance | Not a direct blueprint or endorsement for this product |
| E13 | NASA NPO-50838-1 Telemetry anomaly detection | NASA software catalogue | Describes LSTM-based anomaly detection on spacecraft telemetry | Optional research inspiration for anomaly detection on time-series telemetry | Not suitable as a drop-in phishing/notice detector |
| E14 | SpaceCOP Community Edition | Open-source aerospace project | cFS spacecraft IDS uses rules, behaviour indicators and structured CTI | Layered detection pattern is a useful design analogy | Spacecraft code/runtime not portable to this web app |
| E15 | Discord Safety Center | Platform safety guidance | Warns about QR-login social engineering | QR destination preview and no automatic open | Does not establish the prevalence of such attacks in the college |

## Competitor differentiation

CyberRakshak should not claim to beat Truecaller, Cyberwall or Garud360 at broad scam detection or security training. The defensible college-project hypothesis is the specific workflow:

- trusted campus issuer registration;
- cryptographically signed, versioned campus notice records;
- public canonical verification;
- second-person approval for payment/placement-sensitive changes;
- campus-scoped incident handoff.

This is a proposed integration of workflows, not a claim that each underlying technique is novel.

## Source URLs

- E01 RBI: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23810
- E02 MHA/PIB: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287674
- E03 Google CASE: https://research.google/pubs/case-an-agentic-ai-framework-for-enhancing-scam-intelligence-in-digital-payments/
- E04 NIST 800-61r3: https://csrc.nist.gov/pubs/sp/800/61/r3/final
- E05 OWASP Top 10 2025: https://top10.owasp.org/2025/
- E06 OWASP GenAI LLM Top 10 2026: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10
- E07 NPCI: https://www.npci.org.in/fraud-awareness
- E08 Truecaller: https://corporate.truecaller.com/newsroom/press-release/truecaller-scam-checker-brings-together-scam-detection-and-community-intelligence?id=CF9222986F234D5B
- E09 Kerala Police Cyberwall: https://cyberwall.keralapolice.gov.in/
- E10 Garud360: https://www.garud360.com/
- E11 MongoDB: https://www.mongodb.com/docs/atlas/build-multi-tenant-arch/
- E12 ISRO: https://www.isro.gov.in/ISC2MIT2026.html
- E13 NASA: https://software.nasa.gov/software/NPO-50838-1
- E14 SpaceCOP: https://github.com/the-aerospace-corporation/spacecop-ce
- E15 Discord: https://discord.com/safety/securing-your-discord-account

## Presentation rules

1. Cite the source and publication date on the slide.
2. Label facts, product descriptions, research results and CyberRakshak proposals distinctly.
3. Never transfer a competitor's performance or scale numbers to CyberRakshak.
4. Do not combine incident counts from different reporting systems with different definitions.
5. Do not claim that a public QR, AI score or clean URL guarantees safety.
6. Show actual CyberRakshak test results only after running the tests.
