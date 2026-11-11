import { apiRequest } from "./api";

export const sendChatMessage = async (messages) => {
  const data = await apiRequest("/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
    timeoutMs: 30000,
  });
  return data;
};
