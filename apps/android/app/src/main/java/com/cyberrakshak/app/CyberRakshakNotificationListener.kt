package com.cyberrakshak.app

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class CyberRakshakNotificationListener : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val notification = sbn.notification ?: return
        val extras = notification.extras
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()
        if (title.isBlank() && text.isBlank()) return

        val result = NotificationClassifier.classify("$title\n$text")
        if (result.score >= 45) {
            Log.i(TAG, "Safety signal: ${result.level}; reasons=${result.reasons.size}")
            NotificationWarningDispatcher.publish(this, sbn.packageName, result)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) = Unit

    companion object {
        private const val TAG = "CyberRakshak"
    }
}
