import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../services/chatService";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Chatbot.css";

const STORAGE_KEY = "cyberrakshak:ai-conversation";
const PROFILE_KEY = "cyberrakshak:safety-profile";
const MAX_LOCAL_MESSAGES = 24;

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const starterMessage = {
  id: "welcome",
  text: "Namaste 👋 I’m CyberRakshak AI. I can explain a suspicious situation, teach you a safety skill, help you respond after an incident, or guide you to the right CyberRakshak feature.",
  sender: "bot",
  timestamp: new Date().toISOString(),
};

const tools = [
  { icon: "🔍", label: "Check message", prompt: "I received a suspicious message. Help me identify the warning signs and tell me the safest next steps." },
  { icon: "🎓", label: "Teach me", prompt: "Teach me one practical cyber-safety lesson with a simple real-world scenario and a quick question at the end." },
  { icon: "🆘", label: "I need help", prompt: "I may have been affected by a cyber scam. Give me a calm incident-response checklist and tell me which official channel to use." },
  { icon: "🧠", label: "Explain simply", prompt: "Explain phishing, social engineering, and why people fall for them using simple everyday examples." },
  { icon: "🛡️", label: "Privacy check", prompt: "Teach me what sensitive information I should never share online, even if someone claims to be from a bank, company, police or government." },
  { icon: "❓", label: "Quiz me", prompt: "Give me a short cyber-safety scenario quiz with three questions. Wait for my answer before revealing the correct answer." },
];

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved.slice(-MAX_LOCAL_MESSAGES);
  } catch {
    // Ignore malformed local conversation state.
  }
  return [starterMessage];
}

function loadAgeGroup() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY))?.ageGroup || "";
  } catch {
    return "";
  }
}

function formatReply(text) {
  const lines = String(text || "").split("\n");
  return lines.map((line, index) => (
    <span key={`${index}-${line}`}>{line}{index < lines.length - 1 ? <br /> : null}</span>
  ));
}

function CyberToolCard({ tool, onClick }) {
  return (
    <button type="button" className="cyber-tool-card" onClick={onClick}>
      <span className="cyber-tool-icon" aria-hidden="true">{tool.icon}</span>
      <span><strong>{tool.label}</strong><small>Open guided mode</small></span>
      <span className="cyber-tool-arrow" aria-hidden="true">→</span>
    </button>
  );
}

function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const bottomRef = useRef(null);
  const { language, languages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTool, setActiveTool] = useState("chat");
  const [interactionId, setInteractionId] = useState(null);
  const [ageGroup, setAgeGroup] = useState(loadAgeGroup);

  const latestMessages = useMemo(() => messages.slice(-12), [messages]);
  void latestMessages;

  const persist = (nextMessages) => {
    const trimmed = nextMessages.slice(-MAX_LOCAL_MESSAGES);
    setMessages(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Conversation can continue even when local storage is unavailable.
    }
    window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
  };

  const saveAge = (nextAgeGroup) => {
    setAgeGroup(nextAgeGroup);
    try {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, ageGroup: nextAgeGroup, language }));
    } catch {
      // Ignore storage restrictions.
    }
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    try {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, ageGroup, language: nextLanguage }));
    } catch {
      // Ignore storage restrictions.
    }
  };

  const clearConversation = () => {
    setInteractionId(null);
    setError("");
    persist([starterMessage]);
  };

  const sendMessage = async (text, toolName = "chat") => {
    const trimmed = String(text || "").trim();
    if (!trimmed || isLoading) return;

    const userMessage = { id: makeId(), text: trimmed, sender: "user", timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setActiveTool(toolName);
    persist(nextMessages);
    setInputValue("");
    setError("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        messages: nextMessages.map((message) => ({ role: message.sender === "user" ? "user" : "assistant", content: message.text })),
        language,
        ageGroup,
        previousInteractionId: interactionId,
      });
      const botMessage = { id: makeId(), text: response.reply || "I could not generate a useful response right now.", sender: "bot", timestamp: new Date().toISOString(), provider: response.provider };
      persist([...nextMessages, botMessage]);
      setInteractionId(response.interactionId || null);
    } catch (requestError) {
      setError(requestError.message || "The safety assistant is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleTool = (tool) => {
    if (tool.label === "Check message") {
      navigate("/check");
      setIsOpen(false);
      return;
    }
    if (tool.label === "I need help") {
      navigate("/emergency-help");
      setIsOpen(false);
      return;
    }
    sendMessage(tool.prompt, tool.label);
  };

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find((message) => message.sender === "user");
    if (lastUser) sendMessage(lastUser.text, "regenerate");
  };

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Copy is unavailable in this browser context.");
    }
  };

  const toggleOpen = () => setIsOpen((open) => !open);

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="CyberRakshak AI Safety Copilot" aria-modal="true">
          <header className="chatbot-header">
            <div className="chatbot-brand">
              <div className="chatbot-avatar" aria-hidden="true">🛡️</div>
              <div><strong>CyberRakshak AI</strong><span><i className="status-dot" /> Safety Copilot • {language}</span></div>
            </div>
            <div className="chatbot-header-actions">
              <button type="button" onClick={clearConversation} aria-label="Start a new conversation" title="New conversation">＋</button>
              <button type="button" onClick={toggleOpen} aria-label="Close AI assistant" title="Close">×</button>
            </div>
          </header>

          <div className="chatbot-context-bar">
            <span>Advanced guidance with a safe fallback</span>
            <div>
              <select value={language} aria-label="AI language" onChange={(event) => changeLanguage(event.target.value)}>
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={ageGroup} aria-label="AI age group" onChange={(event) => saveAge(event.target.value)}>
                <option value="">Profile</option><option value="teen">Teen</option><option value="young-adult">Young Adult</option><option value="adult">Adult</option><option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="chatbot-tool-switcher" role="tablist" aria-label="CyberRakshak AI modes">
            <button type="button" className={activeTool === "chat" ? "active" : ""} onClick={() => setActiveTool("chat")}>💬 Chat</button>
            <button type="button" className={activeTool === "teach" ? "active" : ""} onClick={() => setActiveTool("teach")}>🎓 Learn</button>
            <button type="button" className={activeTool === "privacy" ? "active" : ""} onClick={() => setActiveTool("privacy")}>🔐 Safety</button>
          </div>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <article key={message.id} className={`message ${message.sender === "user" ? "user" : "bot"}`}>
                <div className="message-meta"><span>{message.sender === "user" ? "You" : "CyberRakshak AI"}</span><time dateTime={message.timestamp}>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>
                <div className="message-content">{formatReply(message.text)}</div>
                {message.sender === "bot" && index > 0 ? <div className="message-actions"><button type="button" onClick={() => copyMessage(message.text)}>Copy</button><button type="button" onClick={handleRegenerate}>Regenerate</button></div> : null}
                {message.provider === "deterministic-fallback" ? <small className="fallback-note">Local safety fallback used</small> : null}
              </article>
            ))}
            {isLoading ? <article className="message bot"><div className="message-meta"><span>CyberRakshak AI</span><span>thinking…</span></div><div className="message-content"><span className="thinking"><span /><span /><span /></span></div></article> : null}
            {error ? <div className="chatbot-error" role="alert">⚠️ {error}</div> : null}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && !isLoading ? <div className="cyber-tools" aria-label="Guided cyber safety tools"><div className="cyber-tools-heading"><strong>What should we do?</strong><span>Choose a guided path instead of starting with a blank chat.</span></div><div className="cyber-tools-grid">{tools.map((tool) => <CyberToolCard key={tool.label} tool={tool} onClick={() => handleTool(tool)} />)}</div></div> : null}
          {activeTool === "teach" && messages.length > 1 ? <div className="mode-hint">🎓 Learning mode: ask for a lesson, scenario, flashcards or a quiz.</div> : null}
          {activeTool === "privacy" && messages.length > 1 ? <div className="mode-hint">🔐 Safety mode: never paste passwords, OTPs, PINs, CVVs, recovery codes or tokens here.</div> : null}

          <form onSubmit={handleSend} className="chatbot-input-form">
            <textarea value={inputValue} onChange={(event) => setInputValue(event.target.value)} placeholder={location.pathname === "/check" ? "Ask about this suspicious message…" : "Message CyberRakshak AI…"} maxLength={2000} rows={1} disabled={isLoading} aria-label="Message CyberRakshak AI" />
            <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send message">↑</button>
          </form>
          <footer className="chatbot-footer">AI can be wrong. Verify important claims. Never share secrets.</footer>
        </div>
      )}

      {!isOpen ? <button type="button" className="chatbot-toggle" onClick={toggleOpen} aria-label="Open CyberRakshak AI Safety Copilot" aria-expanded="false"><span className="toggle-icon">🛡️</span><span className="toggle-label">Ask CyberRakshak</span><span className="toggle-dot" aria-hidden="true" /></button> : null}
    </div>
  );
}

export default Chatbot;
