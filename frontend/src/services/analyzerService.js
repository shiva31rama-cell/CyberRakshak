import { analyzeMessage } from "../../../shared/analyzer/messageAnalyzer.mjs";
import { API_BASE_URL, apiRequest } from "./api";

/**
 * Analyse a message. Uses the backend API when one is configured; otherwise
 * (or if the server is unreachable) runs the same open rule engine in the browser.
 */
export async function analyse(text) {
  if (API_BASE_URL) {
    try {
      const data = await apiRequest("/analyze", { method: "POST", body: JSON.stringify({ message: text }), timeoutMs: 10000 });
      return { ...data.result, source: "server" };
    } catch (error) {
      if (error.status === 429) throw Object.assign(new Error("rate"), { code: "rate" });
      if (error.status === 400) throw Object.assign(new Error("invalid"), { code: error.message?.includes("long") ? "too_long" : "empty" });
      // Network/timeout: fall through to local analysis.
    }
  }
  const result = analyzeMessage(text);
  if (!result.ok) throw Object.assign(new Error(result.error), { code: result.error });
  return { ...result, source: "local" };
}
