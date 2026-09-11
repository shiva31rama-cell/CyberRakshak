# Automated Operations for CyberRakshak

## What can run without a person watching

GitHub Actions can repeatedly perform deterministic engineering checks:

- install dependencies
- run backend syntax checks
- run backend automated tests
- run frontend lint
- run frontend production build
- report failures as a GitHub issue
- propose dependency updates through Dependabot

This creates an always-on feedback loop for repeatable failures.

## What must not be automated blindly

The following should remain reviewable because they can change security behavior or user safety:

- arbitrary source-code rewrites
- automatic production database migrations
- automatic replacement of security rules
- automatic secret rotation without an approved secret-management flow
- automatic deployment of unreviewed dependency upgrades

## Recommended future autonomous loop

```text
Scheduled / PR check
        ↓
Tests + lint + build + health checks
        ↓
Pass ───────────────→ keep green
        ↓
Failure
        ↓
Create/update maintenance issue
        ↓
Developer reviews evidence
        ↓
Fix → CI reruns
```

A later stage may add staging smoke tests and deployment verification. Production-changing automation should require explicit repository/deployment permissions and should remain auditable.

## Why this matters

The objective is to reduce dependence on someone remembering every command. The system automatically checks predictable engineering conditions while keeping security-sensitive decisions human-reviewed.
