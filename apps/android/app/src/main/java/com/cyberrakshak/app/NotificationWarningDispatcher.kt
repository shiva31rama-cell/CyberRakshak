package com.cyberrakshak.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

object NotificationWarningDispatcher {
    private const val CHANNEL_ID = "cyberrakshak-safety"
    private const val BASE_NOTIFICATION_ID = 7302

    fun publish(context: Context, packageName: String, result: NotificationClassifier.Result) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(
                NotificationChannel(
                    CHANNEL_ID,
                    "Cyber safety warnings",
                    NotificationManager.IMPORTANCE_HIGH,
                ).apply {
                    description = "Warnings for strong scam-like notification signals detected on this device"
                },
            )
        }

        val message = result.reasons.joinToString(" • ").ifBlank { "Review this notification before acting." }
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            packageName.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("CyberRakshak: pause before acting")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText("$message\nSource app: $packageName\nRisk level: ${result.level}"))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        manager.notify(BASE_NOTIFICATION_ID + (packageName.hashCode() and 0x7fff), notification)
    }
}
