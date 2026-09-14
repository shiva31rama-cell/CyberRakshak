package com.cyberrakshak.app

/** Lightweight, offline-first classifier. It intentionally produces signals, not certainty. */
object NotificationClassifier {
    data class Result(val score: Int, val level: String, val reasons: List<String>)

    private val urgent = Regex("\\b(urgent|immediately|act now|account suspended|verify now|last warning)\\b", RegexOption.IGNORE_CASE)
    private val payment = Regex("\\b(upi|payment|refund|cashback|collect request|bank transfer)\\b", RegexOption.IGNORE_CASE)
    private val credential = Regex("\\b(otp|pin|cvv|password|verification code|login)\\b", RegexOption.IGNORE_CASE)
    private val link = Regex("https?://\\S+", RegexOption.IGNORE_CASE)
    private val apk = Regex("\\b(apk|install this app|download app)\\b", RegexOption.IGNORE_CASE)

    fun classify(text: String): Result {
        var score = 0
        val reasons = mutableListOf<String>()
        if (urgent.containsMatchIn(text)) { score += 25; reasons += "Urgent or threatening language" }
        if (payment.containsMatchIn(text)) { score += 20; reasons += "Payment-related request" }
        if (credential.containsMatchIn(text)) { score += 30; reasons += "Credential or verification request" }
        if (link.containsMatchIn(text)) { score += 15; reasons += "Contains a link" }
        if (apk.containsMatchIn(text)) { score += 25; reasons += "App installation request" }
        score = score.coerceAtMost(100)
        val level = when {
            score >= 70 -> "critical"
            score >= 45 -> "high"
            score >= 25 -> "medium"
            score > 0 -> "low"
            else -> "info"
        }
        return Result(score, level, reasons.distinct())
    }
}
