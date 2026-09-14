package com.cyberrakshak.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat

object NotificationWarningDispatcher {
    private const val CHANNEL_ID = "cyberrakshak-safety"
    private const val NOTIFICATION_ID = 7302

    fun publish(context: Context, packageName: String, result: NotificationClassifier.Result) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "Cyber safety warnings", NotificationManager.IMPORTANCE_HIGH)
            )
        }
        val message = result.reasons.joinToString(" • ").ifBlank { "Review this notification before acting." }
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("CyberRakshak: pause before acting")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText("$message\nSource app: $packageName\nRisk level: ${result.level}"))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
        manager.notify(NOTIFICATION_ID, notification)
    }
}
