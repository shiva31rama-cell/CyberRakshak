package com.cyberrakshak.app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val title = TextView(this).apply {
            text = "CyberRakshak protection"
            textSize = 26f
            setPadding(32, 48, 32, 16)
        }
        val description = TextView(this).apply {
            text = "Enable notification access to let CyberRakshak check suspicious notification text locally. You remain in control of this permission."
            textSize = 16f
            setPadding(32, 8, 32, 24)
        }
        val button = Button(this).apply {
            text = "Open notification access settings"
            setOnClickListener {
                startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
            }
        }
        setContentView(LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(title)
            addView(description)
            addView(button)
        })
    }
}
