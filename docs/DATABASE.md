# Database

The application uses MongoDB through Mongoose. The authoritative schema definitions are in \`backend/models/\`; the former empty SQL files did not describe the runtime data model and have been removed.

## Connection settings

- \`MONGODB_URI\` is the backend application database connection.
- \`MONGODB_TEST_URI\` is optional and must point to a separate database with \`test\` in its name.

Set these values only in \`backend/.env\` or in the deployment environment. Never commit connection strings or credentials.

## Persistence smoke test

Run \`npm run test:db\` from the repository root after configuring \`MONGODB_TEST_URI\`. The script checks the target database name before connecting, then creates, reads, updates, and removes one synthetic \`ScamReport\`. Cleanup filters by the ID created by that run.
