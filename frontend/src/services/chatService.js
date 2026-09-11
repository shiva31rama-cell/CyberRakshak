import { apiRequest } from "./api";

export async function sendChatMessage({ messages, language = "English", ageGroup = "", previousInteractionId = null }) {
  return apiRequest("/chat", {
    method: "POST",
    timeoutMs: 24000,
    body: JSON.stringify({ messages, language, ageGroup, previousInteractionId }),
  });
}
