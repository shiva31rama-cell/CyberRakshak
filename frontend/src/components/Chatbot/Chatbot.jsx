import { useState } from "react";
import { sendChatMessage } from "../../services/chatService";
import "./Chatbot.css";

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: makeId(),
      text: "Hello! I'm CyberRakshak AI Assistant. Ask me about cyber safety, scams, phishing, passwords, OTPs or UPI safety.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: makeId(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputValue("");
    setError("");
    setIsLoading(true);

    try {
      const history = nextMessages
        .slice(-12)
        .map((message) => ({
          role: message.sender === "user" ? "user" : "assistant",
          content: message.text,
        }));
      const data = await sendChatMessage(history);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          text: data.reply || "I couldn't generate a response. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.message || "The assistant is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question) => sendMessage(question);

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close CyberRakshak AI" : "Open CyberRakshak AI"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✖️" : "💬"}
      </button>

      <div className={`chatbot-window ${isOpen ? "active" : ""}`} aria-hidden={!isOpen}>
        <div className="chatbot-header">
          <h3>🤖 CyberRakshak AI</h3>
          <p>Defensive cyber-safety guidance</p>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === "user" ? "user" : "bot"}`}>
              <div className="message-content">{message.text}</div>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content"><span className="typing-indicator"><span></span><span></span><span></span></span></div>
            </div>
          )}
          {error && <div className="chatbot-error" role="alert">{error}</div>}
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="quick-questions">
            <p>Quick questions:</p>
            <button type="button" onClick={() => handleQuickQuestion("How can I identify phishing?")}>⚠️ Phishing</button>
            <button type="button" onClick={() => handleQuickQuestion("How do I stay safe from UPI scams?")}>💳 UPI Safety</button>
            <button type="button" onClick={() => handleQuickQuestion("How should I protect my passwords?")}>🔐 Password Safety</button>
            <button type="button" onClick={() => handleQuickQuestion("What should I do after a scam?")}>🚨 Scam Response</button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="chatbot-input-form">
          <input
            type="text"
            placeholder="Ask a cyber-safety question…"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={isLoading}
            className="chatbot-input"
            maxLength={2000}
            aria-label="Cyber-safety question"
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()} className="chatbot-send-btn">{isLoading ? "…" : "Send"}</button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
