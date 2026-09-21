const KNOWLEDGE_BASE = require("../data/cyberKnowledge");
const { classify } = require("../services/ai/cyberRelevanceService");
const { safetyInstruction } = require("../services/safety/sensitiveInputService");
const aiService = require("../services/ai/aiService");

const DEFAULT_SYSTEM_PROMPT = `You are CyberRakshak, a friendly and responsible cyber-safety assistant for general users.

CORE ROLE:
- Be conversational for greetings and capability questions, then guide naturally toward cyber safety.
- Supported topics: phishing, scams, suspicious links, online fraud, UPI/payment safety, OTP safety, passwords, MFA, compromised phones/accounts, malware awareness, privacy, social engineering, cyberbullying/reporting, digital safety and incident response.
- If clearly unrelated, politely redirect to CyberRakshak topics rather than answering the unrelated request.

PROGRESSIVE INCIDENT TRIAGE:
- Treat an incident as: IDENTIFY -> ASSESS IMPACT -> CONTAIN -> RECOVER/REPORT -> PREVENT.
- Do not repeat questions already answered.
- Ask at most 1-2 high-value questions at a time.
- Never request passwords, OTPs, PINs, CVVs, recovery codes, API keys or authentication secrets.
- Never declare an account/device compromised solely from one symptom.
- For urgent financial fraud, lead with immediate contact with the bank/payment provider and appropriate official reporting.

RELIABILITY AND SAFETY:
- Treat supplied CyberRakshak knowledge context as the primary grounding for relevant claims.
- Never invent helplines, portals, policies, legal rules, product features, or technical facts.
- Never claim CyberRakshak or another service took an action unless confirmed by the application.
- Do not provide instructions for unauthorized access, credential theft, malware deployment, evasion, or other harmful cyber activity.
- Keep responses concise, empathetic, practical and easy to continue.
- If uncertain, say what is uncertain instead of guessing.`;

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
  const recoverySignals = /recovered|regained access|case number|complaint|reported|support contacted|account restored/.test(conversation);
  if (recoverySignals || containmentSignals) return "recover_report";
  if (impactSignals) return "contain";
  return "identify_assess";
};

const getGrounding = (incidentType) => {
  const item = KNOWLEDGE_BASE[incidentType] || KNOWLEDGE_BASE.general;
  return { title: item.title, facts: item.facts, immediateActions: item.immediateActions, avoid: item.avoid, sources: item.sources };
};

const formatGroundingForModel = (grounding) => `\n\nCYBERRAKSHAK KNOWLEDGE CONTEXT\nTopic: ${grounding.title}\nEstablished facts:\n${grounding.facts.map((item) => `- ${item}`).join("\n")}\nImmediate defensive actions:\n${grounding.immediateActions.map((item) => `- ${item}`).join("\n")}\nAvoid:\n${grounding.avoid.length ? grounding.avoid.map((item) => `- ${item}`).join("\n") : "- None specified."}\nUse only this context for grounded claims. Do not invent details.\n`;

const fallbackReply = (message) => {
  const text = String(message || "").trim().toLowerCase();
  const relevance = classify(text);
  if (relevance.isGreeting) return "Hi! 👋 I'm CyberRakshak, your cyber-safety assistant. I can help with scams, phishing, suspicious links, UPI/payment fraud, OTP/password safety, privacy, malware and cyber incidents. Tell me what happened and we'll work through it safely. 🛡️";
  if (!relevance.isCyberRelated) return "I’m CyberRakshak 🛡️, so I focus on cyber safety and online security. I can help with phishing, scams, suspicious links, UPI/payment fraud, OTP/password safety, privacy, malware, account/device safety and cyber incident reporting.";
  if (/money lost|money debited|unauthori[sz]ed.*(?:transaction|payment)|upi fraud|bank fraud|financial fraud|payment fraud/.test(text)) return "🚨 If money was lost or an unauthorized transaction occurred, contact your bank/payment provider immediately and use India's official cyber-fraud reporting channels. Do not share OTPs, PINs, CVVs or passwords. Keep transaction IDs and relevant evidence safe.";
  if (/account hacked|account compromised|account taken|can't login|cannot login/.test(text)) return "🔐 Let's check this safely. Do you still have access to the account, and did you notice an unfamiliar login or a recovery/password change you did not make? Please don't send the password or any OTP/recovery code.";
  if (/phish|suspicious link|fake website|suspicious email|suspicious message/.test(text)) return "⚠️ Did you click the link/open the attachment, or did you only receive the message? Please don't paste any password, OTP, PIN or other secret here.";
  if (/otp|pin|cvv|password/.test(text)) return "🔑 Never share an OTP, UPI PIN, card PIN, CVV, password or recovery code. Tell me what happened around the request without including the secret itself.";
  return "I can help with that cyber-safety issue. Tell me what happened—what device, account, message, link or transaction is involved? Please don't share passwords, OTPs, PINs, CVVs, recovery codes or other secrets.";
};

const sanitizeMessages = (messages) => messages.filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string").slice(-12).map((item) => ({ role: item.role, content: item.content.trim().slice(0, 4000) }));

exports.chat = async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const latestUserMessage = [...messages].reverse().find((item) => item?.role === "user")?.content;
    if (!latestUserMessage || typeof latestUserMessage !== "string" || !latestUserMessage.trim()) return res.status(400).json({ success: false, message: "Please provide a message" });
    if (latestUserMessage.length > 2000) return res.status(400).json({ success: false, message: "Message is too long" });

    const safeMessages = sanitizeMessages(messages);
    const normalized = latestUserMessage.trim();
    const relevance = classify(normalized);
    const incidentType = detectIncidentType(normalized) || safeMessages.map((item) => detectIncidentType(item.content)).find(Boolean) || null;
    const triageStage = detectTriageStage(safeMessages, incidentType);
    const grounding = getGrounding(incidentType);

    if (!relevance.isCyberRelated) {
      return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak scope guard", intent: "non_cyber", incidentType: null, triageStage: "general", sources: [] });
    }

    const secretWarning = safetyInstruction(normalized);
    const triageHint = incidentType
      ? `Incident category: ${incidentType}. Current triage stage: ${triageStage}. Continue from this stage; do not repeat answered questions.`
      : "If this is an incident, identify its category and ask only the most useful next question.";
    const systemPrompt = process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const providerMessages = [{ role: "system", content: `${systemPrompt}\n${triageHint}\n${secretWarning}${formatGroundingForModel(grounding)}` }, ...safeMessages];

    if (!process.env.AI_API_KEY || !process.env.AI_API_URL || !process.env.AI_MODEL) {
      return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", intent: relevance.intent, incidentType, triageStage, sources: grounding.sources });
    }

    try {
      const reply = await aiService.generate(providerMessages);
      return res.json({ success: true, reply, provider: "AI", intent: relevance.intent, incidentType, triageStage, sources: grounding.sources });
    } catch (providerError) {
      console.error("AI provider request failed:", providerError.message);
      return res.json({ success: true, reply: fallbackReply(normalized), provider: "CyberRakshak safety fallback", intent: relevance.intent, incidentType, triageStage, sources: grounding.sources });
    }
  } catch (error) {
    console.error("Chat service error:", error.message);
    return res.json({ success: true, reply: fallbackReply(req.body?.messages?.at?.(-1)?.content), provider: "CyberRakshak safety fallback", intent: "cyber_assistance", incidentType: null, triageStage: "general", sources: KNOWLEDGE_BASE.general.sources });
  }
};
