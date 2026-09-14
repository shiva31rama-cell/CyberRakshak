package com.cyberrakshak.app

import android.content.Context
import java.util.concurrent.TimeUnit

/** Minimal local state. Notification content is not uploaded or retained beyond the latest signal. */
object WarningStore {
    private const val PREFS = "cyberrakshak_warning"
    private const val LAST_AT = "last_at"
    private const val LAST_PACKAGE = "last_package"
    private const val LAST_TITLE = "last_title"
    private const val LAST_LEVEL = "last_level"
    private const val LAST_SCORE = "last_score"
    private const val LAST_REASONS = "last_reasons"
    private const val COOLDOWN_MS = 2 * 60 * 1000L

    data class Snapshot(
        val packageName: String,
        val title: String,
        val level: String,
        val score: Int,
        val reasons: List<String>,
        val timestamp: Long,
    )

    fun shouldNotify(context: Context, result: NotificationClassifier.Result, packageName: String): Boolean {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val lastAt = prefs.getLong(LAST_AT, 0L)
        val lastScore = prefs.getInt(LAST_SCORE, -1)
        val lastPackage = prefs.getString(LAST_PACKAGE, "")
        val now = System.currentTimeMillis()

        if (now - lastAt < COOLDOWN_MS && lastPackage == packageName && result.score <= lastScore + 10) return false
        return true
    }

    fun save(context: Context, packageName: String, title: String, result: NotificationClassifier.Result) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putLong(LAST_AT, System.currentTimeMillis())
            .putString(LAST_PACKAGE, packageName)
            .putString(LAST_TITLE, title.take(160))
            .putString(LAST_LEVEL, result.level)
            .putInt(LAST_SCORE, result.score)
            .putString(LAST_REASONS, result.reasons.joinToString("\n") { it.take(160) })
            .apply()
    }

    fun latest(context: Context): Snapshot? {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val timestamp = prefs.getLong(LAST_AT, 0L)
        if (timestamp <= 0L) return null
        val reasons = prefs.getString(LAST_REASONS, "").orEmpty()
            .split("\n").filter { it.isNotBlank() }
        return Snapshot(
            packageName = prefs.getString(LAST_PACKAGE, "").orEmpty(),
            title = prefs.getString(LAST_TITLE, "").orEmpty(),
            level = prefs.getString(LAST_LEVEL, "info").orEmpty(),
            score = prefs.getInt(LAST_SCORE, 0),
            reasons = reasons,
            timestamp = timestamp,
        )
    }

    fun ageLabel(snapshot: Snapshot): String {
        val minutes = TimeUnit.MILLISECONDS.toMinutes((System.currentTimeMillis() - snapshot.timestamp).coerceAtLeast(0L))
        return when {
            minutes < 1 -> "just now"
            minutes == 1L -> "1 minute ago"
            minutes < 60 -> "$minutes minutes ago"
            else -> "over 1 hour ago"
        }
    }
}
