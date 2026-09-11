# Realtime Safety Event Contract

This contract prepares CyberRakshak for real-time dashboards and notifications without coupling the application to a specific database implementation.

## Event envelope

```json
{
  "event": "scam.report.created",
  "version": 1,
  "eventId": "uuid",
  "occurredAt": "ISO-8601 timestamp",
  "actor": "user|admin|system",
  "data": {}
}
```

## Initial events

- `scam.analysis.completed`
- `scam.report.created`
- `scam.report.status_changed`
- `feedback.created`
- `admin.alert.created`
- `system.health_changed`

## Rules

1. Events contain identifiers and derived metadata, not secrets.
2. Do not publish passwords, OTPs, tokens, payment credentials or raw authentication material.
3. Consumers must tolerate duplicate delivery.
4. Consumers must ignore unknown event versions safely.
5. Authorization is required before a user receives user-specific events.
6. Admin/SOC events require server-side authorization and must never rely on frontend role checks alone.

## PostgreSQL-ready implementation

The preferred future implementation can use PostgreSQL `LISTEN/NOTIFY` for lightweight internal signaling and WebSockets/Socket.IO for browser delivery. Durable events should be persisted separately when audit/replay guarantees are required.
