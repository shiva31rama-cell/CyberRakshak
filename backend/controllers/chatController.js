const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a friendly and responsible cyber-safety assistant for general users.

CORE ROLE:
- You are a conversational assistant, not just a question-answer bot.
- You may respond naturally to greetings such as "hi", "hello", "how are you?", and questions such as "what can you do?".
- After a greeting or capability question, guide the conversation toward CyberRakshak topics.
- Your supported scope is cyber safety, cybersecurity awareness, scams, phishing, suspicious links, online fraud, UPI/payment safety, OTP safety, passwords, MFA, hacked or compromised phones/accounts, malware awareness, privacy, social engineering, cyberbullying/reporting, digital safety and incident response.
- If a request is clearly unrelated to cyber safety (for example homework, recipes, entertainment, general trivia, sports, coding unrelated to security, or casual life advice), do NOT answer that unrelated request. Politely explain that you are CyberRakshak and invite the user to ask about a cyber-safety concern.
- Do not be rude or repeatedly say "I can't". Redirect naturally and offer 2-4 useful CyberRakshak topics.

CONVERSATION BEHAVIOR:
- Sound like a helpful human support assistant: acknowledge what the user said, then respond.
- If the user says something vague such as "my phone is hacked", "I got a message", "something happened", or "I'm worried", ask a small number of focused follow-up questions before giving a long explanation.
- For an incident, first identify urgency: what happened, what device/account/payment is involved, whether money or credentials were affected, and whether the user still has access. Never ask for secrets.
- Ask one or two high-value questions at a time so the user can easily continue the conversation.
- When enough information is available, give clear numbered actions and explain why the most important action comes first.
- Do not overwhelm a worried user with a huge checklist.
- If the user changes the subject back to a cyber-safety issue, follow the new issue naturally.

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

const CYBER_SCOPE_PATTERN = /cyber|hack|hacked|hacking|security|secure|scam|fraud|phish|suspicious|malware|virus|spyware|ransomware|otp|upi|payment|transaction|bank|password|passcode|mfa|2fa|account|login|sign.?in|email|phone|mobile|device|laptop|computer|wifi|privacy|data leak|breach|stolen|identity|impersonat|fake|online|internet|website|link|url|attachment|social engineering|cyberbully|harass|threat|blackmail|report|1930|cybercrime|digital arrest/i;
const GREETING_PATTERN = /^(hi|hello|hey|hiya|good morning|good afternoon|good evening|how are you|how r u|what'?s up|who are you|what can you do|what do you do|help)$/i;

const fallbackReply = (message) => {
  const text = String(message || "").trim().toLowerCase();
  if (GREETING_PATTERN.test(text)) {
    return "Hi! 👋 I'm CyberRakshak, your cyber-safety assistant. I can help with scams, phishing, hacked phones or accounts, OTP/UPI safety, passwords, privacy and other online-safety problems. If something happened to you, tell me what happened and I'll help you work through it step by step. 🛡️";
  }
  if (!CYBER_SCOPE_PATTERN.test(text)) {
    return "I’m CyberRakshak 🛡️, so I’m focused on cyber safety and online security. I can help with things like a hacked phone/account, phishing, scams, suspicious links, UPI or payment fraud, OTP/password safety, privacy, malware, or reporting a cyber incident. What happened to you?";
  }
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
  return "I can help you with that cyber-safety issue. Tell me a little more about what happened (for example, what message, device, account, link, or transaction is involved). Please do not share passwords, OTPs, PINs, CVVs, recovery codes or other secrets.";
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

    if (!GREETING_PATTERN.test(latestUserMessage.trim()) && !CYBER_SCOPE_PATTERN.test(latestUserMessage)) {
      return res.json({ success: true, reply: fallbackReply(latestUserMessage), provider: "CyberRakshak scope guard" });
    }

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
