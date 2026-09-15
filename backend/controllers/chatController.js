const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a friendly and responsible cyber-safety assistant for general users.

CORE ROLE:
- Be conversational for greetings and capability questions, then guide naturally toward cyber safety.
- Supported topics: phishing, scams, suspicious links, online fraud, UPI/payment safety, OTP safety, passwords, MFA, compromised phones/accounts, malware awareness, privacy, social engineering, cyberbullying/reporting, digital safety and incident response.
- If clearly unrelated, politely redirect to CyberRakshak topics rather than answering the unrelated request.

INCIDENT TRIAGE:
- For a possible incident, behave like a calm first-line triage assistant.
- Identify the incident type from context: phishing, financial fraud, account compromise, device compromise, malware, impersonation/social engineering, privacy/data exposure, cyberbullying/harassment, or general prevention.
- Ask only 1-2 high-value questions at a time. Do not interrogate the user.
- Ask about observable facts, not secrets: what happened, what was clicked/opened, which type of account/device/payment was involved, whether money or account access changed, and whether the user still has access.
- Never ask for passwords, OTPs, PINs, CVVs, recovery codes, API keys, or private authentication secrets.
- Once enough facts are available, give a short prioritized action plan: NOW, NEXT, and REPORT/GET HELP when applicable.
- Do not claim a phone or account is definitely hacked merely from symptoms; distinguish signs from confirmed compromise.
- If the situation is urgent, lead with containment rather than explanations.

RELIABILITY AND SAFETY:
- Prefer established defensive guidance over guesses.
- Never invent helplines, portals, policies, legal rules, product features, or technical facts.
- If country/app/bank/device context matters, ask for it.
- Never claim CyberRakshak or another service took an action unless confirmed by the application.
- For financial cyber fraud in India, advise immediate contact with the bank/payment provider and official reporting through 1930 or the National Cyber Crime Reporting Portal when appropriate; do not promise recovery.
- Do not provide instructions for unauthorized access, credential theft, malware deployment, evasion, or other harmful cyber activity.
- Keep responses concise, empathetic, practical and easy to continue.
- If uncertain, say what is uncertain instead of guessing.`;

const CYBER_SCOPE_PATTERN = /cyber|hack|hacked|hacking|security|secure|scam|fraud|phish|suspicious|malware|virus|spyware|ransomware|otp|upi|payment|transaction|bank|password|passcode|mfa|2fa|account|login|sign.?in|email|phone|mobile|device|laptop|computer|wifi|privacy|data leak|breach|stolen|identity|impersonat|fake|online|internet|website|link|url|attachment|social engineering|cyberbully|harass|threat|blackmail|report|1930|cybercrime|digital arrest/i;
const GREETING_PATTERN = /^(hi|hello|hey|hiya|good morning|good afternoon|good evening|how are you|how r u|what'?s up|who are you|what can you do|what do you do|help)$/i;

const INCIDENT_PATTERNS = [
  { type: "financial_fraud", pattern: /money lost|money debited|unauthori[sz]ed.*(?:transaction|payment)|upi fraud|bank fraud|financial fraud|payment fraud|sent money.*scam|scammed.*money|transaction.*not mine/i },
  { type: "phishing", pattern: /phish|suspicious link|fake website|suspicious email|suspicious message|clicked.*link|link.*clicked|attachment/i },
  { type: "account_compromise", pattern: /account hacked|account compromised|account taken|someone.*logged in|unknown login|can't login|cannot login|lost access|password.*changed|email.*hacked/i },
  { type: "device_compromise", pattern: /phone hacked|mobile hacked|device hacked|computer hacked|laptop hacked|phone.*compromised|device.*compromised|unknown app|strange app|pop.?ups|phone.*acting strange/i },
  { type: "malware", pattern: /malware|spyware|ransomware|virus|trojan|infected|malicious app/i },
  { type: "impersonation", pattern: /impersonat|pretend.*me|fake.*profile|social engineering|blackmail|threat/i },
  { type: "privacy", pattern: /privacy|data leak|personal data|photos.*leak|information.*leak|dox/i },
  { type: "cyberbullying", pattern: /cyberbully|online harassment|harass|abuse online/i },
];

const detectIncidentType = (text) => INCIDENT_PATTERNS.find((item) => item.pattern.test(text))?.type || null;

const fallbackReply = (message) => {
  const text = String(message || "").trim().toLowerCase();
  if (GREETING_PATTERN.test(text)) return "Hi! 👋 I'm CyberRakshak, your cyber-safety assistant. I can help with scams, phishing, hacked phones or accounts, OTP/UPI safety, passwords, privacy and online-safety problems. If something happened, tell me what you noticed and we'll work through it step by step. 🛡️";
  if (!CYBER_SCOPE_PATTERN.test(text)) return "I’m CyberRakshak 🛡️, so I focus on cyber safety and online security. I can help with hacked phones/accounts, phishing, scams, suspicious links, UPI or payment fraud, OTP/password safety, privacy, malware, or reporting a cyber incident. What happened?";
  if (/money lost|money debited|unauthori[sz]ed.*(?:transaction|payment)|upi fraud|bank fraud|financial fraud|payment fraud/.test(text)) return "🚨 If money was lost or an unauthorized transaction occurred, contact your bank/payment provider immediately and report cyber financial fraud through India's official 1930 helpline or the National Cyber Crime Reporting Portal. Do not share OTPs, PINs, CVVs or passwords. Keep transaction IDs, timestamps and relevant evidence safe.";
  if (/account hacked|account compromised|account taken|can't login|cannot login/.test(text)) return "🔐 Let's check this safely. Do you still have access to the account, and did you notice an unfamiliar login, changed recovery details, or a password change you did not make? Please don't send me the password or any OTP/recovery code.";
  if (/phone hacked|mobile hacked|device hacked|computer hacked|laptop hacked/.test(text)) return "📱 Let's narrow this down before assuming the phone is hacked. What unusual thing did you notice—an unknown app, unexpected pop-ups, unfamiliar account activity, or something else? Don't share passwords or codes.";
  if (/phish|suspicious link|fake website|suspicious email|suspicious message/.test(text)) return "⚠️ Let's check the risk. Did you click the link/open the attachment, or did you only receive the message? Please don't paste any password, OTP, PIN or other secret here.";
  if (/otp|pin|cvv|password/.test(text)) return "🔑 Never share an OTP, UPI PIN, card PIN, CVV, password or recovery code. Tell me what happened around the request, without including the secret itself, and I can guide you safely.";
  if (/upi/.test(text)) return "💳 Before approving a UPI payment, verify the recipient and amount. A UPI PIN authorizes a payment; it is not needed to receive money. Tell me what happened if you think a payment was fraudulent.";
  return "I can help with that cyber-safety issue. Tell me a little more about what happened—what device, account, message, link or transaction is involved? Please don't share passwords, OTPs, PINs, CVVs, recovery codes or other secrets.";
};

const sanitizeMessages = (messages) => messages.filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string").slice(-12).map((item) => ({ role: item.role, content: item.content.trim().slice(0, 4000) }));
const containsSecret = (text) => /(?:otp|one[- ]time password|upi pin|card pin|cvv|cvc|password|passcode|recovery code|api key)\s*[:=]\s*\S+/i.test(text);

const callProvider = async ({ apiUrl, apiKey, model, messages }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, temperature: 0.1, max_tokens: 650, messages }), signal: controller.signal });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply || reply.length > 8000) throw new Error("AI provider returned an invalid response");
    return reply;
  } finally { clearTimeout(timeout); }
};

exports.chat = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const latestUserMessage = [...messages].reverse().find((item) => item?.role === "user")?.content;
    if (!latestUserMessage || typeof latestUserMessage !== "string" || !latestUserMessage.trim()) return res.status(400).json({ success: false, message: "Please provide a message" });
    if (latestUserMessage.length > 2000) return res.status(400).json({ success: false, message: "Message is too long" });
    const safeMessages = sanitizeMessages(messages);
    if (!safeMessages.some((item) => item.role === "user")) return res.status(400).json({ success: false, message: "Please provide a user message" });

    const normalized = latestUserMessage.trim();
    const incidentType = detectIncidentType(normalized);
    const secretWarning = containsSecret(normalized) ? "The user may have included an authentication secret. Never repeat it. Tell them not to share secrets and continue with safe next steps." : "";
    const triageHint = incidentType ? `Detected incident category: ${incidentType}. Continue conversational triage. Ask at most 1-2 high-value questions if key facts are missing; otherwise provide prioritized actions.` : "If this is an incident, identify its category and ask only the most useful next question.";
    const systemPrompt = process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const providerMessages = [{ role: "system", content: `${systemPrompt}\n${triageHint}\n${secretWarning}` }, ...safeMessages];

    if (!GREETING_PATTERN.test(normalized) && !CYBER_SCOPE_PATTERN.test(normalized)) return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak scope guard", incidentType: null });

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const model = process.env.AI_MODEL;
    if (!apiKey || !apiUrl || !model) return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", incidentType });
    try {
      const reply = await callProvider({ apiUrl, apiKey, model, messages: providerMessages });
      return res.json({ success: true, reply, provider: "AI", incidentType });
    } catch (providerError) {
      console.error("AI provider request failed:", providerError.message);
      return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", incidentType });
    }
  } catch (error) {
    console.error("Chat service error:", error.message);
    return res.json({ success: true, reply: fallbackReply(req.body?.messages?.at?.(-1)?.content), provider: "CyberRakshak safety fallback", incidentType: null });
  }
};
