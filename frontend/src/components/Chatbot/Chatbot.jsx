import { useState } from "react";
import { sendChatMessage } from "../../services/chatService";
import "./Chatbot.css";

const quickQuestions = [
  ["👋 Say Hi", "Hi! What can you help me with?"],
  ["📱 Phone Hacked", "I think my phone is hacked. What should I do?"],
  ["⚠️ Suspicious Message", "I received a suspicious message. Can you help me understand what to do?"],
  ["💳 Money Lost", "I think I may have lost money to an online scam. What should I do first?"],
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! 👋 I'm CyberRakshak AI. I can chat with you about cyber safety, scams, phishing, hacked phones or accounts, UPI/OTP safety, passwords, privacy and online threats.\n\nIf something happened to you, tell me what happened. I'll ask a few simple questions and help you step by step. 🛡️\n\nPlease never send me your password, OTP, PIN, CVV or recovery code.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: content,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiMessages = nextMessages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => ({ role: message.role, content: message.text }));

      const data = await sendChatMessage(apiMessages);
      const reply = data?.reply?.trim() || "I couldn't generate a response right now. Please try again.";

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: `Sorry, I couldn't reach the AI service. ${error.message || "Please try again."}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="chatbot-toggle"
        aria-label={isOpen ? "Close CyberRakshak AI" : "Open CyberRakshak AI"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "✖️" : "💬"}
      </button>

      <section className={`chatbot-window ${isOpen ? "active" : ""}`} aria-label="CyberRakshak AI chat">
        <header className="chatbot-header">
          <h3>🤖 CyberRakshak AI</h3>
          <p>Your friendly cyber-safety guide</p>
        </header>

        <div className="chatbot-messages" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role === "user" ? "user" : "bot"}`}>
              <div className="message-content">{message.text}</div>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <span className="typing-indicator" aria-label="AI is responding">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="quick-questions">
            <p>Try a conversation starter:</p>
            {quickQuestions.map(([label, question]) => (
              <button key={label} type="button" onClick={() => sendMessage(question)} disabled={isLoading}>
                {label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="chatbot-input-form">
          <input
            type="text"
            placeholder="Tell me what happened..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={isLoading}
            className="chatbot-input"
            maxLength={2000}
            aria-label="Chat message"
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()} className="chatbot-send-btn">
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Chatbot;
