# Database notes

## Current production database

CyberRakshak currently uses **MongoDB with Mongoose**. The application connects through `backend/config/db.js` and expects `MONGODB_URI`.

The deployed architecture should therefore use a managed MongoDB service such as MongoDB Atlas rather than the unused SQL placeholder files in this directory.

## Current collections/models

The backend currently defines Mongoose models for:

- Users
- Scam reports
- Feedback
- Quizzes
- User quiz results

## PostgreSQL migration

PostgreSQL is a future migration option, not the current runtime database. The empty SQL files in this directory must not be treated as the application's active schema.

A future migration should be done as a deliberate backend change: define relational tables, constraints and indexes; migrate existing data; update controllers/services; replace Mongoose connection/model usage; run the complete CI and end-to-end suite; and only then change the deployment database.
