import { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm CyberRakshak AI Assistant. How can I help you stay safe online?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const predefinedResponses = {
    hello: "👋 Hello! I'm here to help you with cyber security questions.",
    password:
      "🔐 Strong passwords should be at least 12 characters, include uppercase, lowercase, numbers, and symbols. Never share your password!",
    phishing:
      "⚠️ Phishing emails try to trick you into revealing personal info. Never click links from unknown senders and verify email addresses carefully.",
    otp: "🔑 Never share your OTP (One-Time Password) with anyone, including bank employees or support staff!",
    scam: "🚨 If you've been scammed, report it immediately. Use our Report Scam feature for assistance.",
    upi: "💳 UPI Safety: Always verify the recipient before sending money. Don't share your UPI PIN with anyone.",
    social:
      "📱 Social Media Safety: Enable 2FA, don't accept friend requests from strangers, and be careful what you share.",
    default:
      "I'm still learning! Please visit our Learning Center or Emergency Help section for more information.",
  };

  const generateResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (messageLower.includes(key)) {
        return response;
      }
    }

    return predefinedResponses.default;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateResponse(question),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Chatbot Floating Button */}
      <div
        className={`chatbot-container ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="chatbot-toggle">{isOpen ? "✖️" : "💬"}</div>

        {/* Chatbot Window */}
        <div className={`chatbot-window ${isOpen ? "active" : ""}`}>
          <div className="chatbot-header">
            <h3>🤖 CyberRakshak AI</h3>
            <p>Always here to help</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === "user" ? "user" : "bot"}`}
              >
                <div className="message-content">{message.text}</div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <button
                onClick={() => handleQuickQuestion("Tell me about passwords")}
              >
                🔐 Password Safety
              </button>
              <button onClick={() => handleQuickQuestion("What is phishing?")}>
                ⚠️ Phishing
              </button>
              <button onClick={() => handleQuickQuestion("OTP safety")}>
                🔑 OTP Safety
              </button>
              <button
                onClick={() => handleQuickQuestion("Social media safety")}
              >
                📱 Social Media
              </button>
            </div>
          )}

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="chatbot-send-btn"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
