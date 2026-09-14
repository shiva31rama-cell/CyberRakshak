# CyberRakshak Android Companion

This Android companion is the device-side foundation for CyberRakshak's notification protection layer.

## What it does

- Uses Android's `NotificationListenerService` after the user explicitly enables notification access.
- Extracts notification title/text locally.
- Runs a lightweight local warning classifier before any optional server request.
- Does not silently read arbitrary app databases, SMS databases, photos, or private chats.
- Does not store notification content by default.

## Current flow

`Notification posted → local classifier → safety warning callback → optional app UI`

The companion is intentionally local-first. A production release should add a visible settings screen, an opt-in app allowlist, encrypted API transport, and a user-controlled retention policy before enabling cloud analysis.

## Platform limitation

Android notification access does not provide unrestricted access to every message, image, video, or QR code on the device. Content that is unavailable in a notification must use an explicit share/import flow in the CyberRakshak app.
