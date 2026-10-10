import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ComingSoonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ feature?: string }>();
  const feature = typeof params.feature === "string" ? params.feature : "This feature";
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>CYBPRO · IN DEVELOPMENT</Text>
        <Text style={styles.title}>{feature}</Text>
        <Text style={styles.body}>This capability is planned, but is not available in this preview yet. We will only mark it complete after the processing pipeline, safety controls, and tests are in place.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.button}><Text style={styles.buttonText}>Back to home</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071321" }, content: { flex: 1, justifyContent: "center", padding: 26 },
  eyebrow: { color: "#73f0c2", fontSize: 10, fontWeight: "800", letterSpacing: 1.3 }, title: { color: "#f5f8ff", fontSize: 30, fontWeight: "900", marginTop: 14 },
  body: { color: "#a9b9cc", fontSize: 14, lineHeight: 23, marginTop: 12 }, button: { backgroundColor: "#73f0c2", borderRadius: 10, alignItems: "center", padding: 14, marginTop: 24 },
  buttonText: { color: "#062019", fontSize: 13, fontWeight: "900" }
} as const);