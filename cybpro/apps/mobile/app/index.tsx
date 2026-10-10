import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
type Report = { status: string; risk: string; confidence: string; indicators: string[]; guidance: string[]; caveat: string };

function ActionCard({ icon, title, description, onPress }: { icon: string; title: string; description: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
      <View style={styles.actionIcon}><Text style={styles.actionEmoji}>{icon}</Text></View>
      <View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDescription}>{description}</Text></View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlBusy, setUrlBusy] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [urlReport, setUrlReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  async function analyze() {
    if (!message.trim() || busy) return;
    setBusy(true); setError(""); setReport(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze/text`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: message })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Analysis failed");
      setReport(body as Report);
    } catch {
      setError("Could not reach CYBPRO API. Set EXPO_PUBLIC_API_BASE_URL to your computer's LAN IP when testing on a phone.");
    } finally { setBusy(false); }
  }

  async function analyzeUrl() {
    if (!urlInput.trim() || urlBusy) return;
    setUrlBusy(true); setUrlError(""); setUrlReport(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze/url`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: urlInput })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "URL analysis failed");
      setUrlReport(body as Report);
    } catch {
      setUrlError("Could not reach CYBPRO API. Check the API address and network connection.");
    } finally { setUrlBusy(false); }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.logo}><Text style={styles.logoText}>✓</Text></View>
              <View><Text style={styles.brand}>CYB<Text style={styles.brandAccent}>PRO</Text></Text><Text style={styles.brandCaption}>CYBER PROTECTION</Text></View>
            </View>
            <View style={styles.previewPill}><View style={styles.dot} /><Text style={styles.previewText}>PREVIEW</Text></View>
          </View>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>DIGITAL TRUST, BUILT DIFFERENTLY</Text>
            <Text style={styles.heroTitle}>Pause before{"\n"}you <Text style={styles.heroAccent}>trust it.</Text></Text>
            <Text style={styles.heroDescription}>Understand suspicious messages and links with clear signals, evidence, and practical next steps — not just an AI guess.</Text>
            <View style={styles.trustRow}><Text style={styles.trustItem}>🛡️ Privacy-minded</Text><Text style={styles.trustItem}>⌕ Explainable</Text></View>
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>YOUR FIRST LINE OF DEFENCE</Text>
            <Text style={styles.sectionTitle}>Check a message</Text>
            <Text style={styles.sectionDescription}>Paste suspicious text to inspect basic warning signs.</Text>
          </View>
          <View style={styles.scannerCard}>
            <Text style={styles.fieldLabel}>MESSAGE OR TEXT</Text>
            <TextInput accessibilityLabel="Suspicious message or text" multiline maxLength={12000} value={message} onChangeText={setMessage} placeholder="Paste the message here…" placeholderTextColor="#657b92" textAlignVertical="top" style={styles.input} />
            <Text style={styles.privacyHint}>Avoid sharing passwords, OTPs, PINs, or private information.</Text>
            <Pressable accessibilityRole="button" disabled={!message.trim() || busy} onPress={analyze} style={({ pressed }) => [styles.primaryButton, (!message.trim() || busy) && styles.disabledButton, pressed && styles.pressed]}>
              {busy ? <ActivityIndicator color="#071b19" /> : <Text style={styles.primaryButtonText}>Analyze safely  ↗</Text>}
            </Pressable>
          </View>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {report ? (
            <View style={styles.reportCard} accessibilityLiveRegion="polite">
              <Text style={styles.reportTitle}>Initial signal report</Text>
              <Text style={styles.risk}>Risk signal: {report.risk.replaceAll("_", " ")}</Text>
              <Text style={styles.reportText}>Confidence: {report.confidence} (limited rule-based coverage)</Text>
              <Text style={styles.reportText}>{report.caveat}</Text>
              <Text style={styles.reportHeading}>Indicators observed</Text>
              {report.indicators.length ? report.indicators.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>) : <Text style={styles.reportText}>No configured warning patterns detected. That does not prove this message is safe.</Text>}
              <Text style={styles.reportHeading}>Safer next steps</Text>
              {report.guidance.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
            </View>
          ) : null}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>LINK CHECKING</Text>
            <Text style={styles.sectionTitle}>Inspect a URL</Text>
            <Text style={styles.sectionDescription}>Checks visible URL traits locally. CYBPRO will not open the submitted address.</Text>
          </View>
          <View style={styles.scannerCard}>
            <Text style={styles.fieldLabel}>WEBSITE ADDRESS</Text>
            <TextInput accessibilityLabel="Website address to inspect" autoCapitalize="none" autoCorrect={false} keyboardType="url" maxLength={2048} value={urlInput} onChangeText={setUrlInput} placeholder="https://example.com" placeholderTextColor="#657b92" style={styles.urlInput} />
            <Text style={styles.privacyHint}>Never enter passwords or private tokens in a URL.</Text>
            <Pressable accessibilityRole="button" disabled={!urlInput.trim() || urlBusy} onPress={analyzeUrl} style={({ pressed }) => [styles.primaryButton, (!urlInput.trim() || urlBusy) && styles.disabledButton, pressed && styles.pressed]}>
              {urlBusy ? <ActivityIndicator color="#071b19" /> : <Text style={styles.primaryButtonText}>Inspect URL  ↗</Text>}
            </Pressable>
          </View>
          {urlError ? <Text accessibilityRole="alert" style={styles.error}>{urlError}</Text> : null}
          {urlReport ? <View style={styles.reportCard} accessibilityLiveRegion="polite">
            <Text style={styles.reportTitle}>URL signal report</Text>
            <Text style={styles.risk}>Risk signal: {urlReport.risk.replaceAll("_", " ")}</Text>
            <Text style={styles.reportText}>Confidence: {urlReport.confidence} (limited rule-based coverage)</Text>
            <Text style={styles.reportText}>{urlReport.caveat}</Text>
            <Text style={styles.reportHeading}>Observable URL traits</Text>
            {urlReport.indicators.length ? urlReport.indicators.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>) : <Text style={styles.reportText}>No configured URL warning traits observed. This does not mean the destination is safe.</Text>}
          </View> : null}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>MORE WAYS TO STAY SAFE</Text>
            <Text style={styles.sectionTitle}>Your protection toolkit</Text>
          </View>
          <ActionCard icon="🔗" title="Advanced link tools" description="More link checks are planned" onPress={() => router.push("/coming-soon?feature=Advanced%20link%20tools")} />
          <ActionCard icon="🖼️" title="Image, audio & files" description="Multimodal analysis is planned" onPress={() => router.push("/coming-soon?feature=Media%20analysis")} />
          <ActionCard icon="🆘" title="I've been scammed" description="Incident guidance is being built" onPress={() => router.push("/coming-soon?feature=Incident%20response")} />
          <View style={styles.footer}><Text style={styles.footerBrand}>CYBPRO · CYBER PROTECTION</Text><Text style={styles.footerText}>Early preview. Not a definitive security verdict or a substitute for official incident response.</Text></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: "#071321" }, container: { paddingHorizontal: 20, paddingBottom: 34 },
  topBar: { paddingTop: 8, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: "#1b3045", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, logo: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: "#3c8b79", backgroundColor: "#102c31", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#73f0c2", fontSize: 25, fontWeight: "700" }, brand: { color: "#f4f8ff", fontWeight: "900", fontSize: 20, letterSpacing: -0.8 }, brandAccent: { color: "#73f0c2" },
  brandCaption: { color: "#8296ac", fontSize: 8, letterSpacing: 1.7, marginTop: 1 }, previewPill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#29435a", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 7 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: "#73f0c2" }, previewText: { color: "#a9c1d8", fontSize: 9, letterSpacing: 1 },
  hero: { paddingTop: 36, paddingBottom: 34 }, eyebrow: { color: "#73f0c2", fontSize: 10, fontWeight: "800", letterSpacing: 1.3 }, heroTitle: { color: "#f5f8ff", fontSize: 46, lineHeight: 52, fontWeight: "900", letterSpacing: -2, marginTop: 15 },
  heroAccent: { color: "#73f0c2" }, heroDescription: { color: "#a9b9cc", fontSize: 14, lineHeight: 23, marginTop: 15 }, trustRow: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 19 }, trustItem: { color: "#c4d1e0", fontSize: 11 },
  sectionHeader: { marginBottom: 14, marginTop: 8 }, sectionEyebrow: { color: "#73f0c2", fontSize: 9, fontWeight: "800", letterSpacing: 1.4 }, sectionTitle: { color: "#f5f8ff", fontSize: 24, fontWeight: "800", letterSpacing: -0.5, marginTop: 7 },
  sectionDescription: { color: "#8fa2b8", fontSize: 12, lineHeight: 18, marginTop: 5 }, scannerCard: { borderWidth: 1, borderColor: "#294056", backgroundColor: "#0e2032", borderRadius: 15, padding: 16, marginBottom: 12 },
  fieldLabel: { color: "#dce8f5", fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 11 }, input: { minHeight: 130, maxHeight: 240, borderWidth: 1, borderColor: "#263d53", backgroundColor: "#091725", borderRadius: 10, padding: 13, color: "#f2f7ff", fontSize: 13, lineHeight: 20 },
  urlInput: { minHeight: 48, borderWidth: 1, borderColor: "#263d53", backgroundColor: "#091725", borderRadius: 10, paddingHorizontal: 13, color: "#f2f7ff", fontSize: 13 },
  privacyHint: { color: "#8197ad", fontSize: 10, lineHeight: 16, marginTop: 10 }, primaryButton: { minHeight: 46, backgroundColor: "#73f0c2", borderRadius: 9, alignItems: "center", justifyContent: "center", marginTop: 14 },
  primaryButtonText: { color: "#062019", fontWeight: "900", fontSize: 12 }, disabledButton: { opacity: 0.55 }, pressed: { opacity: 0.78 }, error: { color: "#ffb4a8", fontSize: 12, lineHeight: 18, marginBottom: 12 },
  reportCard: { backgroundColor: "#102337", borderColor: "#31516b", borderWidth: 1, borderRadius: 13, padding: 16, marginBottom: 22 }, reportTitle: { color: "#73f0c2", fontSize: 16, fontWeight: "800" },
  risk: { color: "#ffd18b", fontWeight: "800", textTransform: "capitalize", marginTop: 12 }, reportText: { color: "#b9c9db", fontSize: 12, lineHeight: 19, marginTop: 8 },
  reportHeading: { color: "#f1f6ff", fontSize: 12, fontWeight: "800", marginTop: 15, marginBottom: 5 }, bullet: { color: "#b9c9db", fontSize: 12, lineHeight: 19, marginTop: 4 },
  actionCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#20364b", backgroundColor: "#0c1c2d", borderRadius: 12, padding: 14, marginBottom: 9 },
  actionIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: "#153039", alignItems: "center", justifyContent: "center" }, actionEmoji: { fontSize: 18 }, actionCopy: { flex: 1 },
  actionTitle: { color: "#edf4fd", fontSize: 13, fontWeight: "800" }, actionDescription: { color: "#8fa2b8", fontSize: 11, lineHeight: 16, marginTop: 4 }, chevron: { color: "#73f0c2", fontSize: 26 },
  footer: { borderTopWidth: 1, borderTopColor: "#1b3045", marginTop: 24, paddingTop: 18 }, footerBrand: { color: "#91a8c0", fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  footerText: { color: "#72869d", fontSize: 10, lineHeight: 16, marginTop: 8 }
});
