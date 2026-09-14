package com.cyberrakshak.app

/** Privacy-safe event contract shared by the Android companion and future sync/API layers. */
data class SafetyEvent(
    val eventId: String,
    val sourcePackage: String,
    val sourceTitle: String,
    val inputType: String = "notification",
    val riskLevel: String,
    val score: Int,
    val reasons: List<String>,
    val detectedAt: Long,
    val syncAllowed: Boolean = false,
)
