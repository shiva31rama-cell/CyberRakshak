import { useState } from "react";
import { sendChatMessage } from "../../services/chatService";
import "./Chatbot.css";

const createMessage = (sender, text) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text,
  sender,
  timestamp: new Date(),
});

const fallbackReply = (text) => {
  const value = String(text || "").toLowerCase();
  if (value.includes("otp")) {
    return "🔑 Never share an OTP. Legitimate support teams do not need your OTP to receive or release a payment.";
  }
  if (value.includes("upi")) {
    return "💳 Verify the recipient and amount before approving a UPI payment. Your UPI PIN authorizes a payment; never share it or enter it to receive money.";
  }
  if (value.includes("phish")) {
    return "⚠️ Check the sender and website address independently. Avoid unexpected links or attachments and never enter secrets from a suspicious message.";
  }
  if (value.includes("password")) {
    return "🔐 Use a unique password for important accounts and enable multi-factor authentication where available. Never share your password.";
  }
  return "I can help with phishing, scams, OTP/UPI safety, passwords, account security and safe next steps. Please do not share passwords, OTPs, PINs, CVVs or recovery codes.";
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    createMessage(
      "bot",
      "Hello! I'm CyberRakshak. I can help you understand suspicious messages, scams and safer next steps."
    ),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const askAssistant = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiMessages = nextMessages
        .filter((message) => message.sender === "user" || message.sender === "bot")
        .slice(-12)
        .map((message) => ({
          role: message.sender === "user" ? "user" : "assistant",
          content: message.text,
        }));

      const data = await sendChatMessage(apiMessages);
      const reply = data?.reply?.trim() || fallbackReply(trimmed);
      setMessages((current) => [...current, createMessage("bot", reply)]);
    } catch (error) {
      console.error("CyberRakshak chat request failed", error);
      setMessages((current) => [
        ...current,
        createMessage("bot", fallbackReply(trimmed)),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    void askAssistant(inputValue);
  };

  const handleQuickQuestion = (question) => {
    void askAssistant(question);
  };

  return (
    <>
      <button
        type="button"
        className={`chatbot-container ${isOpen ? "open" : ""}`}
        aria-expanded={isOpen}
        aria-controls="cyberrakshak-chat-window"
        aria-label={isOpen ? "Close CyberRakshak assistant" : "Open CyberRakshak assistant"}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="chatbot-toggle" aria-hidden="true">
          {isOpen ? "✖️" : "💬"}
        </span>
      </button>

      <section
        id="cyberrakshak-chat-window"
        className={`chatbot-window ${isOpen ? "active" : ""}`}
        aria-label="CyberRakshak AI assistant"
        aria-hidden={!isOpen}
      >
        <div className="chatbot-header">
          <h3>🤖 CyberRakshak</h3>
          <p>Cyber-safety guidance, with a local fallback</p>
        </div>

        <div className="chatbot-messages" aria-live="polite">
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
              <div className="message-content" aria-label="Assistant is thinking">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="quick-questions">
            <p>Try one:</p>
            <button type="button" onClick={() => handleQuickQuestion("How do I spot phishing?")}>
              ⚠️ Phishing
            </button>
            <button type="button" onClick={() => handleQuickQuestion("How should I protect my OTP?")}>
              🔑 OTP safety
            </button>
            <button type="button" onClick={() => handleQuickQuestion("How can I stay safe with UPI?")}>
              💳 UPI safety
            </button>
            <button type="button" onClick={() => handleQuickQuestion("How should I protect my passwords?")}>
              🔐 Passwords
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="chatbot-input-form">
          <input
            type="text"
            placeholder="Ask a cyber-safety question…"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={isLoading}
            maxLength={2000}
            className="chatbot-input"
            aria-label="Ask CyberRakshak a question"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="chatbot-send-btn"
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
}

export default Chatbot;
