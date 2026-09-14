# CyberRakshak 2.0 — Android → Check Center Handoff

## Implemented flow

1. Android NotificationListenerService performs local classification.
2. WarningStore keeps only the latest minimal safety signal on-device.
3. The user explicitly taps **Share latest safety signal**.
4. Android uses the normal share sheet with safety metadata only.
5. The installed CyberRakshak PWA registers `/share` as a Web Share Target.
6. `share-worker.js` receives the POST request and stores the shared payload in IndexedDB.
7. The worker redirects to `/check?share=1`.
8. Check Center consumes the newest share item, removes it from the inbox, and places it into the editable message workspace.
9. The user can inspect/edit the imported content and run the normal deterministic analysis.

## Privacy boundary

- No raw Android notification content is automatically uploaded to the CyberRakshak backend.
- The Android handoff is user initiated.
- No notification text is placed in a URL query string.
- The browser share inbox is local IndexedDB and expires items after 10 minutes.
- The shared Android signal is explicitly labelled as a signal, not proof of maliciousness.
- Cloud AI remains a separate opt-in path in Multimodal Check.

## Browser/platform limitation

Web Share Target requires an installed PWA and browser support. Android remains fully useful without it: the user can open CyberRakshak manually and paste/import content into Check Center.

## Next integration

The next hardening step should add end-to-end automated browser coverage for the installed-PWA share path and Android build coverage, then improve the Check Center UI for imported-origin context and one-tap recheck.
