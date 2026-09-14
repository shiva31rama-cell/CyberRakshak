package com.cyberrakshak.app

/** Offline-first classifier. It produces safety signals, never certainty. */
object NotificationClassifier {
    data class Result(val score: Int, val level: String, val reasons: List<String>)

    private val urgent = Regex("\\b(urgent|immediately|act now|account suspended|verify now|last warning|within .* hours?)\\b", RegexOption.IGNORE_CASE)
    private val payment = Regex("\\b(upi|payment|refund|cashback|collect request|bank transfer|send money|pay now)\\b", RegexOption.IGNORE_CASE)
    private val credential = Regex("\\b(otp|pin|cvv|password|verification code|login code|passcode)\\b", RegexOption.IGNORE_CASE)
    private val link = Regex("https?://\\S+", RegexOption.IGNORE_CASE)
    private val apk = Regex("\\b(apk|install this app|download app|install the app|unknown app)\\b", RegexOption.IGNORE_CASE)
    private val impersonation = Regex("\\b(police|customs|bank officer|government|rbi|cyber crime|courier|tax department)\\b", RegexOption.IGNORE_CASE)

    fun classify(text: String): Result {
        val normalized = text.trim()
        if (normalized.isBlank()) return Result(0, "info", emptyList())

        var score = 0
        val reasons = mutableListOf<String>()
        val hasUrgency = urgent.containsMatchIn(normalized)
        val hasPayment = payment.containsMatchIn(normalized)
        val hasCredential = credential.containsMatchIn(normalized)
        val hasLink = link.containsMatchIn(normalized)
        val hasApk = apk.containsMatchIn(normalized)
        val hasImpersonation = impersonation.containsMatchIn(normalized)

        if (hasUrgency) { score += 20; reasons += "Urgent or threatening language" }
        if (hasPayment) { score += 18; reasons += "Payment-related request" }
        if (hasCredential) { score += 28; reasons += "Credential or verification request" }
        if (hasLink) { score += 12; reasons += "Contains a link" }
        if (hasApk) { score += 28; reasons += "App installation request" }
        if (hasImpersonation) { score += 8; reasons += "Possible authority impersonation" }

        // A single ordinary keyword should not create a high-risk warning.
        // Strong combinations represent the useful notification-level signal.
        if ((hasUrgency && hasCredential) || (hasUrgency && hasPayment) || (hasCredential && hasLink) || (hasApk && hasUrgency)) {
            score += 12
        }

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
