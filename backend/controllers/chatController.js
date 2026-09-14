const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a careful cyber-safety education assistant for general users.

MISSION: Give accurate, practical, defensive guidance about phishing, scams, passwords, MFA, OTPs, UPI safety, account security, malware awareness, privacy, social engineering and incident response.

RELIABILITY RULES:
- Prefer established defensive guidance over guesses.
- Never invent a helpline, government portal, policy, product feature, legal rule, or technical fact.
- If a fact depends on the user's country, bank, app, operating system, or current policy, say so and ask for the missing context when it matters.
- Clearly distinguish what the user should do now from optional prevention advice.
- For an active compromise, prioritize containment and official reporting before explanations.
- Never claim that CyberRakshak, a bank, police agency, or another service has taken an action unless the application actually confirmed it.
- Do not ask for or repeat passwords, OTPs, UPI PINs, card PINs, CVVs, recovery codes, API keys, or other authentication secrets. If the user provides one, tell them not to share it and continue without repeating it.
- Do not provide instructions for unauthorized access, credential theft, malware deployment, evasion, or other harmful cyber activity.
- For financial cyber fraud in India, advise immediate contact with the bank/payment provider and official reporting through 1930 or the National Cyber Crime Reporting Portal when appropriate; do not promise recovery of funds.
- Keep answers concise, structured and action-oriented. Use numbered steps for incidents.
- When uncertain, explicitly say what is uncertain instead of guessing.`;

const fallbackReply = (message) => {
  const text = String(message || "").toLowerCase();
  if (/1930|money|money lost|debited|upi fraud|bank fraud|financial fraud|payment fraud/.test(text)) {
    return "🚨 If money was lost or an unauthorized transaction occurred, contact your bank/payment provider immediately and report cyber financial fraud through India's official 1930 helpline or the National Cyber Crime Reporting Portal. Do not share OTPs, PINs, CVVs or passwords with anyone. Keep transaction IDs, timestamps and relevant evidence safe.";
  }
  if (/account hacked|account taken|can't login|cannot login|account compromised/.test(text)) {
    return "🔐 If an account may be compromised: use the service's official recovery page, change the password from a trusted device, enable MFA, review active sessions/devices, revoke unfamiliar access, and check recovery email/phone settings. Do not share recovery codes or OTPs with anyone.";
  }
  if (/phish|suspicious link|fake website|email scam/.test(text)) {
    return "⚠️ Treat unexpected links and attachments as suspicious. Verify the sender and website independently, avoid entering credentials through the message, and use the organization's official app/site instead. If you already entered credentials, change the affected password from the official site and enable MFA.";
  }
  if (/otp|pin|cvv|password/.test(text)) {
    return "🔑 Never share an OTP, UPI PIN, card PIN, CVV, password or recovery code. Legitimate support should not need your authentication secret. If you already shared one, use the official service immediately to secure the account or payment method.";
  }
  if (/upi/.test(text)) {
    return "💳 Before approving a UPI payment, verify the recipient and amount. A UPI PIN authorizes a payment; it is not needed to receive money. Never share your PIN or OTP.";
  }
  return "I can help with phishing, scams, OTP/UPI safety, passwords, account security, privacy and incident response. Tell me what happened without sharing passwords, OTPs, PINs, CVVs, recovery codes or other secrets.";
};

const sanitizeMessages = (messages) => messages
  .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
  .slice(-12)
  .map((item) => ({ role: item.role, content: item.content.trim().slice(0, 4000) }));

const containsSecret = (text) => /(?:otp|one[- ]time password|upi pin|card pin|cvv|cvc|password|passcode|recovery code|api key)\s*[:=]\s*\S+/i.test(text);

const callProvider = async ({ apiUrl, apiKey, model, messages }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0.1, max_tokens: 650, messages }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const providerError = await response.text().catch(() => "");
      const error = new Error(`AI provider returned ${response.status}`);
      error.providerDetails = providerError.slice(0, 300);
      throw error;
    }
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply || reply.length > 8000) throw new Error("AI provider returned an invalid response");
    return reply;
  } finally {
    clearTimeout(timeout);
  }
};

exports.chat = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const latestUserMessage = [...messages].reverse().find((item) => item?.role === "user")?.content;

    if (!latestUserMessage || typeof latestUserMessage !== "string" || !latestUserMessage.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a message" });
    }
    if (latestUserMessage.length > 2000) return res.status(400).json({ success: false, message: "Message is too long" });

    const safeMessages = sanitizeMessages(messages);
    if (!safeMessages.some((item) => item.role === "user")) return res.status(400).json({ success: false, message: "Please provide a user message" });

    const secretWarning = containsSecret(latestUserMessage)
      ? "The user may have included an authentication secret. Do not repeat it. Tell them not to share secrets and provide safe next steps."
      : "";
    const systemPrompt = process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const providerMessages = [{ role: "system", content: `${systemPrompt}\n${secretWarning}` }, ...safeMessages];

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const model = process.env.AI_MODEL;

    if (!apiKey || !apiUrl || !model) {
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak safety fallback" });
    }

    try {
      const reply = await callProvider({ apiUrl, apiKey, model, messages: providerMessages });
      return res.json({ success: true, reply, provider: "AI" });
    } catch (providerError) {
      console.error("AI provider request failed:", providerError.message);
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak safety fallback" });
    }
  } catch (error) {
    console.error("Chat service error:", error.message);
    return res.json({ success: true, reply: fallbackReply(req.body?.messages?.at?.(-1)?.content), provider: "CyberRakshak safety fallback" });
  }
};
