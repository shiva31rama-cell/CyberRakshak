const KNOWLEDGE_BASE = require("../data/cyberKnowledge");

const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a friendly and responsible cyber-safety assistant for general users.

CORE ROLE:
- Be conversational for greetings and capability questions, then guide naturally toward cyber safety.
- Supported topics: phishing, scams, suspicious links, online fraud, UPI/payment safety, OTP safety, passwords, MFA, compromised phones/accounts, malware awareness, privacy, social engineering, cyberbullying/reporting, digital safety and incident response.
- If clearly unrelated, politely redirect to CyberRakshak topics rather than answering the unrelated request.

PROGRESSIVE INCIDENT TRIAGE:
- Treat an incident as a conversation that progresses through: IDENTIFY -> ASSESS IMPACT -> CONTAIN -> RECOVER/REPORT -> PREVENT.
- Do not repeat questions already answered in the conversation.
- IDENTIFY: determine what happened and the affected device/account/message/payment.
- ASSESS IMPACT: determine whether the user clicked/opened something, shared information, lost money, lost account access, or sees confirmed unfamiliar activity. Ask only what is missing.
- CONTAIN: when risk is credible, give the most important immediate defensive action before optional education.
- RECOVER/REPORT: guide the user to the affected service's official recovery/support process and appropriate official reporting when applicable. Do not claim a report was filed.
- PREVENT: only after immediate risk is addressed, provide 1-3 practical prevention steps.
- Ask at most 1-2 high-value questions at a time. Never interrogate the user.
- Ask about observable facts, not secrets. Never request passwords, OTPs, PINs, CVVs, recovery codes, API keys or authentication secrets.
- Never declare a device/account hacked solely from a symptom; explain that a symptom can have other causes.
- For urgent financial fraud, lead with bank/payment-provider contact and appropriate official reporting.

RELIABILITY AND SAFETY:
- Treat the supplied CyberRakshak knowledge context as the primary factual grounding for the relevant topic.
- Do not contradict grounded facts unless the user provides new information that changes the situation.
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

const detectTriageStage = (messages, incidentType) => {
  if (!incidentType) return "general";
  const conversation = messages.map((item) => item.content).join(" ").toLowerCase();
  const impactSignals = /clicked|opened|entered|shared|sent|debited|lost money|unauthorized|unknown login|lost access|can't login|cannot login|downloaded|installed|compromised/.test(conversation);
  const containmentSignals = /changed password|reset password|enabled mfa|enabled 2fa|revoked|signed out|blocked|contacted bank|bank contacted|reported|froze|secured account/.test(conversation);
  const recoverySignals = /recovered|regained access|case number|complaint|report(ed)?|support contacted|account restored/.test(conversation);
  if (recoverySignals) return "recover_report";
  if (containmentSignals) return "recover_report";
  if (impactSignals) return "contain";
  return "identify_assess";
};

const getGrounding = (incidentType) => {
  const item = KNOWLEDGE_BASE[incidentType] || KNOWLEDGE_BASE.general;
  return {
    title: item.title,
    facts: item.facts,
    immediateActions: item.immediateActions,
    avoid: item.avoid,
    sources: item.sources,
  };
};

const formatGroundingForModel = (grounding) => `\n\nCYBERRAKSHAK KNOWLEDGE CONTEXT\nTopic: ${grounding.title}\nEstablished facts:\n${grounding.facts.map((item) => `- ${item}`).join("\n")}\nImmediate defensive actions:\n${grounding.immediateActions.map((item) => `- ${item}`).join("\n")}\nAvoid:\n${grounding.avoid.length ? grounding.avoid.map((item) => `- ${item}`).join("\n") : "- None specified."}\nUse only this context for grounded claims. Do not invent details.\n`;

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
    const incidentType = detectIncidentType(normalized) || safeMessages.map((item) => item.content).map(detectIncidentType).find(Boolean) || null;
    const triageStage = detectTriageStage(safeMessages, incidentType);
    const grounding = getGrounding(incidentType);
    const secretWarning = containsSecret(normalized) ? "The user may have included an authentication secret. Never repeat it. Tell them not to share secrets and continue with safe next steps." : "";
    const triageHint = incidentType ? `Incident category: ${incidentType}. Current triage stage: ${triageStage}. Continue from this stage; do not repeat answered questions. Ask at most 1-2 missing high-value questions, then move to the next stage when enough information is available.` : "If this is an incident, identify its category and ask only the most useful next question.";
    const systemPrompt = process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const providerMessages = [{ role: "system", content: `${systemPrompt}\n${triageHint}\n${secretWarning}${formatGroundingForModel(grounding)}` }, ...safeMessages];
    if (!GREETING_PATTERN.test(normalized) && !CYBER_SCOPE_PATTERN.test(normalized)) return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak scope guard", incidentType: null, triageStage: "general", sources: [] });
    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const model = process.env.AI_MODEL;
    if (!apiKey || !apiUrl || !model) return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", incidentType, triageStage, sources: grounding.sources });
    try {
      const reply = await callProvider({ apiUrl, apiKey, model, messages: providerMessages });
      return res.json({ success: true, reply, provider: "AI", incidentType, triageStage, sources: grounding.sources });
    } catch (providerError) {
      console.error("AI provider request failed:", providerError.message);
      return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", incidentType, triageStage, sources: grounding.sources });
    }
  } catch (error) {
    console.error("Chat service error:", error.message);
    return res.json({ success: true, reply: fallbackReply(req.body?.messages?.at?.(-1)?.content), provider: "CyberRakshak safety fallback", incidentType: null, triageStage: "general", sources: KNOWLEDGE_BASE.general.sources });
  }
};
