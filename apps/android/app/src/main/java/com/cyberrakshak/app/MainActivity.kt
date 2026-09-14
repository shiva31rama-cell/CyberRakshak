package com.cyberrakshak.app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {
    private lateinit var status: TextView
    private lateinit var latest: TextView
    private var latestSnapshot: WarningStore.Snapshot? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        buildScreen()
    }

    override fun onResume() {
        super.onResume()
        refreshState()
    }

    private fun buildScreen() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 48, 32, 32)
            gravity = Gravity.CENTER_HORIZONTAL
        }

        val title = TextView(this).apply {
            text = "CyberRakshak protection"
            textSize = 26f
        }
        val description = TextView(this).apply {
            text = "CyberRakshak checks notification text on-device for strong scam signals. It does not need passwords, OTPs, PINs or full card numbers."
            textSize = 16f
            setPadding(0, 16, 0, 20)
        }
        status = TextView(this).apply { textSize = 16f; setPadding(0, 8, 0, 20) }
        latest = TextView(this).apply { textSize = 15f; setPadding(0, 8, 0, 20) }

        val settingsButton = Button(this).apply {
            text = "Open notification access settings"
            setOnClickListener { startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
        }
        val shareButton = Button(this).apply {
            text = "Share latest safety signal"
            setOnClickListener { shareLatestSignal() }
        }

        root.addView(title)
        root.addView(description)
        root.addView(status)
        root.addView(latest)
        root.addView(settingsButton)
        root.addView(shareButton)
        setContentView(root)
    }

    private fun refreshState() {
        status.text = "Protection works only after you explicitly enable Notification Access in Android settings."
        latestSnapshot = WarningStore.latest(this)
        latest.text = latestSnapshot?.let { snapshot ->
            buildString {
                append("Latest local safety signal: ${snapshot.level.uppercase()} (${snapshot.score}/100)\n")
                append("From: ${snapshot.packageName}\n")
                if (snapshot.title.isNotBlank()) append("Title: ${snapshot.title}\n")
                append("Detected: ${WarningStore.ageLabel(snapshot)}\n")
                snapshot.reasons.take(4).forEach { append("• $it\n") }
            }
        } ?: "No safety warning has been recorded on this device yet."
    }

    private fun shareLatestSignal() {
        val snapshot = latestSnapshot ?: return
        val shareText = buildString {
            append("CyberRakshak safety signal\n")
            append("Risk: ${snapshot.level.uppercase()} (${snapshot.score}/100)\n")
            append("Source app: ${snapshot.packageName}\n")
            if (snapshot.title.isNotBlank()) append("Notification title: ${snapshot.title}\n")
            append("Reasons:\n")
            snapshot.reasons.take(4).forEach { append("- $it\n") }
            append("\nThis is a local safety signal, not proof that the message is malicious. Check the original content separately in CyberRakshak.")
        }
        startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, shareText)
        }, "Share safety signal"))
    }
}
