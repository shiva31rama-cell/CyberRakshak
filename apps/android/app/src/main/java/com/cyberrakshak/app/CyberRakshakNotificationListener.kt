package com.cyberrakshak.app

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class CyberRakshakNotificationListener : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        // Never analyze CyberRakshak's own warning notifications.
        if (sbn.packageName == packageName) return

        val notification = sbn.notification ?: return
        val extras = notification.extras
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()
        if (title.isBlank() && text.isBlank()) return

        val result = NotificationClassifier.classify("$title\n$text")
        if (result.score >= 45 && WarningStore.shouldNotify(this, result, sbn.packageName)) {
            Log.i(TAG, "Safety signal: ${result.level}; reasons=${result.reasons.size}")
            WarningStore.save(this, sbn.packageName, title, result)
            NotificationWarningDispatcher.publish(this, sbn.packageName, result)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) = Unit

    companion object {
        private const val TAG = "CyberRakshak"
    }
}
