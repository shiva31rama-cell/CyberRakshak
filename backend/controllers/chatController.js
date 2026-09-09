const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a concise cyber-safety education assistant. Give practical, defensive guidance about phishing, scams, passwords, OTPs, UPI safety, account security, malware awareness and incident response. Never request passwords, OTPs, payment PINs, API keys or other secrets. Do not provide instructions that enable unauthorized access, malware deployment, credential theft or other harmful cyber activity. If a user reports an active financial or account compromise, prioritize immediate defensive steps and recommend contacting the relevant bank/service and appropriate official authorities.`;

const fallbackReply = (message) => {
  const text = String(message || "").toLowerCase();
  if (text.includes("phish")) return "⚠️ Phishing is a deceptive message or site designed to steal information. Verify the sender and domain independently, avoid unexpected links or attachments, and never enter passwords or OTPs from a suspicious message.";
  if (text.includes("otp")) return "🔑 Never share an OTP with anyone. Banks and legitimate support teams do not need your OTP to receive or release a payment.";
  if (text.includes("upi")) return "💳 For UPI safety, verify the recipient and amount before approving a transaction. Your UPI PIN is only for authorizing payments—never share it or enter it to receive money.";
  if (text.includes("password")) return "🔐 Use a unique, long password for every important account and enable multi-factor authentication where available. A password manager can help you avoid reuse.";
  if (text.includes("scam")) return "🚨 Stop communicating with the suspected scammer, preserve relevant evidence, contact your bank/service immediately if money or an account is involved, and use CyberRakshak's scam-reporting flow to document the incident.";
  return "I can help with defensive cyber-safety questions such as phishing, scams, OTP/UPI safety, passwords, account security and incident response. For a live incident, tell me what happened without sharing any passwords, OTPs, PINs or other secrets.";
};

exports.chat = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const latestUserMessage = [...messages].reverse().find((item) => item?.role === "user")?.content;

    if (!latestUserMessage || typeof latestUserMessage !== "string" || latestUserMessage.trim().length < 1) {
      return res.status(400).json({ success: false, message: "Please provide a message" });
    }
    if (latestUserMessage.length > 2000) {
      return res.status(400).json({ success: false, message: "Message is too long" });
    }

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const model = process.env.AI_MODEL;

    if (!apiKey || !apiUrl || !model) {
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak safety fallback" });
    }

    const safeMessages = messages
      .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      .slice(-12)
      .map((item) => ({ role: item.role, content: item.content.slice(0, 4000) }));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          { role: "system", content: process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT },
          ...safeMessages,
        ],
      }),
    });

    if (!response.ok) {
      const providerError = await response.text().catch(() => "");
      console.error("AI provider request failed", response.status, providerError.slice(0, 500));
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak safety fallback" });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak safety fallback" });
    }

    return res.json({ success: true, reply, provider: "AI" });
  } catch (error) {
    console.error("Chat service error", error.message);
    return res.json({ success: true, reply: fallbackReply(req.body?.messages?.at?.(-1)?.content), provider: "CyberRakshak safety fallback" });
  }
};
