import { useState } from "react";
import { sendChatMessage } from "../../services/chatService";
import "./Chatbot.css";

const quickQuestions = [
  ["🔐 Password Safety", "How can I make my accounts safer with strong passwords and MFA?"],
  ["⚠️ Phishing", "How can I identify a phishing message or website?"],
  ["🔑 OTP Safety", "What should I do if someone asks me for an OTP?"],
  ["💳 UPI Safety", "What are the safest steps before approving a UPI payment?"],
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm CyberRakshak AI Assistant. Ask me anything about staying safe online. 🛡️",
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
          <p>AI-powered cyber-safety guidance</p>
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
            <p>Quick questions:</p>
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
            placeholder="Ask a cyber-safety question..."
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
