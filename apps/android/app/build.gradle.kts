plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.cyberrakshak.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.cyberrakshak.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "2.0.0"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.17.0")
}
