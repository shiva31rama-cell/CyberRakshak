# CyberRakshak defensive AI data plan

CyberRakshak uses open datasets only as research inputs. Raw malicious URLs, payloads, credentials, malware and personally identifiable information must not be committed to the application repository.

## Candidate public datasets reviewed

| Dataset | Use | Size | License / caution |
|---|---|---:|---|
| `alperozyyurt/phishurl-dataset` | Phishing URL feature classification | 4.5M rows | License is currently `other`; verify every source before redistribution |
| `Him1304/scamshield-scam-detection-data` | SMS and job-scam text classification | 23.7K rows | MIT; English and skewed toward SMS/job scams |
| `ealvaradob/phishing-dataset` | Combined URL, SMS, email and HTML phishing research | 10K–100K samples | Apache-2.0; source provenance must still be tracked |
| `pirocheto/phishing-url` | URL feature benchmark | 11,430 rows | CC-BY-4.0 |
| `Atlas-AI-Labs/GCT-100K` | Social-engineering, OTP, UPI-fraud and behavioural research | 100K rows | Apache-2.0; defensive research use |
| Hugging Face phishing/SMShing collections | Discovery of additional language/domain datasets | varies | Review license and provenance per dataset |

Sources: Hugging Face dataset cards and search listings reviewed on 2026-09-11.

## Training policy

1. Never train on secrets, credentials, private user reports or unconsented personal data.
2. Keep train/validation/test sets separated before model selection.
3. Prefer real-world held-out evaluation over synthetic-only validation.
4. Track language, scam type, source and collection period to detect dataset bias.
5. Report precision, recall, F1, false-positive rate and false-negative rate for safety-critical classifiers.
6. Do not deploy an ML classifier just because it improves an offline score; test its failure modes against benign messages and new scam patterns.
7. Treat open datasets as research material until licenses and provenance are verified.

## Recommended hybrid design

Rules and verified indicators provide deterministic signals. A lightweight classifier can provide scam-category probabilities. An AI language model can explain those signals in simple language. A safety layer should prevent unsupported certainty and keep high-impact actions conservative.

`Input -> normalization -> deterministic signals -> ML probability -> threat intelligence -> explanation -> safety validation`

## Current release

The first intelligence release intentionally uses a deterministic defensive risk engine. This makes the system transparent and cheap to run while a properly labelled, privacy-safe training corpus is prepared and evaluated.
