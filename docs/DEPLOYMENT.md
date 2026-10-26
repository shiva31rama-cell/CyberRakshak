# Deployment and verification

## Local production-like containers

1. Rotate the MongoDB credential that was exposed in chat. Do not reuse it.
2. Copy backend/.env.example to backend/.env and privately set MONGODB_URI and JWT_SECRET. Use only a separate database for MONGODB_TEST_URI, with test in its database name.
3. Set FRONTEND_URL to http://localhost:8080 in backend/.env for local Compose.
4. From the repository root, run docker compose up --build. Open http://localhost:8080. The API is available through the same origin under /api.

The API container runs as the Node non-root user. The web container uses an unprivileged NGINX image. Compose waits for the database-backed API health check before marking the web service ready. API calls are proxied without caching.

## Browser and offline acceptance

CI builds the production frontend and runs a Chromium smoke script against the production preview. It checks 390px, 820px and 1440px viewport widths, the service worker cache, offline deep-link shell loading, and that API calls remain network-only. This is browser emulation; it does not replace physical Android/iOS device, landscape, assistive-technology or low-bandwidth acceptance.

The first visit must be online so the service worker can cache the shell and static assets. Offline chat, scanning, incident generation and official-source lookup are not available because they need the API.

## AWS ECS Fargate

The manual GitHub Actions workflow publishes commit-tagged images to existing ECR repositories and applies deployment/aws/ecs.yml. It creates separate web and API ECS services behind an internet-facing Application Load Balancer. HTTP redirects to HTTPS; API paths are routed to the API target group. MongoDB and JWT values are read from Secrets Manager at task startup. No long-lived AWS access key is stored in the repository.

Prepare these resources before running the workflow:

- A production GitHub environment named production, with deployment protection rules and branch restrictions enabled.
- An AWS OIDC provider and IAM role trusted only for this repository's production environment subject. The workflow needs an AWS_ROLE_TO_ASSUME environment secret and an AWS_REGION environment variable.
- Two existing ECR repositories and GitHub environment variables ECR_BACKEND_REPOSITORY and ECR_FRONTEND_REPOSITORY.
- AWS environment variables AWS_STACK_NAME, AWS_VPC_ID, AWS_PUBLIC_SUBNET_IDS, AWS_PRIVATE_SUBNET_IDS, AWS_MONGODB_SECRET_ARN, AWS_JWT_SECRET_ARN, AWS_FRONTEND_ORIGIN and AWS_CERTIFICATE_ARN.
- At least two public ALB subnets and private Fargate subnets with NAT egress. Add the NAT egress address to the Atlas network access list, or configure private networking.
- An ACM certificate for the chosen frontend hostname, a DNS record pointing that hostname to the stack's load balancer, and matching AWS_FRONTEND_ORIGIN.
- A MongoDB application secret and a separate JWT secret in AWS Secrets Manager. Never put either value in GitHub variables, workflow text or source control.

Restrict the AWS OIDC role trust to the production environment subject for this exact repository, and limit its permissions to the required ECR repositories, CloudFormation stack resources, ECS services/task definitions, IAM pass-role resources, and related logging/load-balancing resources. GitHub recommends environment protection rules for OIDC-backed deployments. Confirm the repository's current OIDC subject format in GitHub before writing the AWS trust condition because repositories may use immutable subject claims.

The deploy workflow runs only when manually started from cyberrakshak-2.0-final. Running it creates or updates AWS infrastructure and incurs AWS charges. This repository change does not create cloud resources or confirm a live deployment.

## MongoDB CRUD verification

The backend test:db script refuses any URI whose effective database names do not all contain test. It writes only one synthetic ScamReport, reads and updates that same record, then deletes it in a finally block. It never prints the URI.

Configure a new dedicated test database privately as MONGODB_TEST_URI in backend/.env or as a private GitHub Actions secret. The connected MongoDB Atlas integration is disabled at the organization level, so this agent could not access a cluster through the connected account. Do not enable production access for this smoke test. Rotate the exposed credential before configuring any private value.

## Official-source evidence boundary

The social-claim endpoint searches the official PIB Press Releases RSS feed using local keyword matching and returns up to three candidate items. The claim text is not sent as a query to PIB. A keyword match is a lead for a person to inspect; it is not a verdict or proof. No social-network posts are scraped or represented as independently verified. Set SOCIAL_EVIDENCE_LOOKUP_ENABLED=false to disable outbound lookup.
