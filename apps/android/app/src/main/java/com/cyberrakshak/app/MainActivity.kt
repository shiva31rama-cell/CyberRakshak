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

        root.addView(title)
        root.addView(description)
        root.addView(status)
        root.addView(latest)
        root.addView(settingsButton)
        setContentView(root)
    }

    private fun refreshState() {
        status.text = "Protection works only after you explicitly enable Notification Access in Android settings."
        val snapshot = WarningStore.latest(this)
        latest.text = if (snapshot == null) {
            "No safety warning has been recorded on this device yet."
        } else {
            buildString {
                append("Latest local safety signal: ${snapshot.level.uppercase()} (${snapshot.score}/100)\n")
                append("From: ${snapshot.packageName}\n")
                if (snapshot.title.isNotBlank()) append("Title: ${snapshot.title}\n")
                append("Detected: ${WarningStore.ageLabel(snapshot)}\n")
                snapshot.reasons.take(4).forEach { append("• $it\n") }
            }
        }
    }
}
