# CyberRakshak ML Foundation

This directory defines a safe path from the deterministic risk engine to validated machine-learning models.

## Planned pipeline

1. Dataset manifest and provenance review
2. License/terms verification
3. Schema normalization
4. Secret and personal-data filtering
5. Train/validation/test split without leakage
6. Feature extraction or text representation
7. Baseline model
8. Precision/recall/F1 and confusion-matrix evaluation
9. Multilingual and demographic robustness checks
10. Calibration and uncertainty checks
11. Model-card documentation
12. Shadow evaluation against the deterministic engine
13. Security review before production exposure

## Safety boundaries

- Do not execute URLs from datasets.
- Do not crawl suspicious domains as part of training.
- Do not commit raw third-party datasets unless redistribution rights are explicitly verified.
- Do not train on credentials, OTPs, tokens or private user reports without a documented lawful purpose and approved privacy controls.
- Keep model outputs advisory and explainable.

## Hybrid decision strategy

The production system should retain the deterministic rules engine as a fallback. A future model may contribute a calibrated signal, but it must not silently replace conservative safety rules.
