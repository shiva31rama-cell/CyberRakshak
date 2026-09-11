# CyberRakshak Defensive Dataset Catalog

Research snapshot: September 2026.

This catalog records candidate public datasets for defensive cybersecurity research. The repository stores metadata and provenance, not third-party raw datasets.

| Dataset | Primary use | Size noted by source | License/terms noted by source | Decision |
|---|---|---:|---|---|
| `alperozyyurt/phishurl-dataset` | Phishing URL classification/features | 4,522,636 rows | `other`; source rights still need verification | Research candidate; do not redistribute raw data |
| `ealvaradob/phishing-dataset` | Combined URL/SMS/email/HTML phishing classification | 10K–100K range | Apache-2.0 shown by dataset card | Candidate after source/provenance audit |
| `pirocheto/phishing-url` | URL phishing benchmark | 11,430 URLs / 87 features | CC-BY-4.0 | Candidate with attribution |
| `Olaroti/phishing-dataset` | URL phishing features | 10,000 rows | MIT shown by dataset card | Candidate; verify upstream feed terms |
| `Him1304/scamshield-scam-detection-data` | Scam/job/SMS text classification | 23,707 rows | MIT; upstream attribution required | Candidate |
| `gandharvbakshi/SMS-dataset-OTP-OTP_INTENT_Phishing` | Indian SMS/OTP/UPI intent classification | 73,470 total SMS according to card statistics | MIT | Strong candidate for India-focused evaluation; audit synthetic/real composition |
| `phreshphish/phreshphish` | Real-world phishing web-page benchmark | 666,315 rows | CC BY 4.0; anti-phishing research use stated | Strong evaluation candidate; large download, keep external |
| `ucirvine/sms_spam` | Baseline SMS spam classification | 5,574 messages | Dataset card does not clearly state a redistribution license | Evaluation/reference only until licensing is confirmed |

## Selection policy

CyberRakshak should not simply merge every public dataset into one training file. Public availability does not automatically mean unrestricted redistribution or commercial use.

Before a dataset enters a training pipeline, record:

- exact dataset identifier
- source URL
- retrieval date
- dataset version/revision
- license
- upstream sources
- redistribution permission
- language coverage
- label definitions
- known synthetic content
- PII/privacy concerns
- duplicate rate
- class distribution
- temporal coverage

## Recommended research mixture

### URL intelligence

Use feature-based phishing datasets for deterministic/ML URL evaluation. Prefer feature tables or normalized URL strings where redistribution rights are uncertain.

### Message intelligence

Combine phishing-email/SMS and scam-message datasets with Indian SMS/OTP intent data. Keep language labels so multilingual evaluation does not accidentally become an English-only benchmark.

### Web intelligence

Use HTML/URL phishing benchmarks for offline model evaluation. Do not crawl or execute dataset URLs as part of application runtime.

### General scam intelligence

Use scam/job-offer datasets as a separate domain so the model can be evaluated independently for phishing, fraud and employment scams.

## Safe repository policy

Do **not** commit raw malicious URL lists, downloaded third-party datasets, executable web content, credentials, cookies, access tokens or private user reports to this repository.

The application can consume a separately managed training artifact or feature store after the license/provenance gate has passed.

## Dataset research sources

- Hugging Face dataset cards are the authoritative starting point for the entries above.
- Each training experiment should preserve its own dataset manifest and checksum.
- The catalog must be reviewed whenever a dataset's license, version or upstream terms change.
