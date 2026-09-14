import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./Feedback.css";

function Feedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ rating: 0, category: "app", comments: "", userName: "", userEmail: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const categories = [
    { value: "app", label: "App Experience", icon: "📱" },
    { value: "content", label: "Content Quality", icon: "📚" },
    { value: "ui", label: "User Interface", icon: "🎨" },
    { value: "performance", label: "Performance", icon: "⚡" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRating = (value) => setFormData((prev) => ({ ...prev, rating: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!formData.rating || formData.comments.trim().length < 10) return;
    setIsLoading(true);
    try {
      await apiRequest("/feedback", { method: "POST", body: JSON.stringify({ ...formData, comments: formData.comments.trim() }), timeoutMs: 15000 });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Unable to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingLabel = (rating) => (["Rate your experience", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating] || "Rate your experience");

  if (submitted) {
    return <div className="feedback-container"><div className="thank-you-box"><div className="thank-you-icon">🙏</div><h1>Thank You!</h1><p>Your feedback has been submitted successfully.</p><p className="thank-you-message">We appreciate your time and will use your feedback to improve CyberRakshak.</p><button className="back-btn" onClick={() => navigate("/")}>Back to Home</button></div></div>;
  }

  return (
    <div className="feedback-container">
      <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="feedback-header"><h1>💬 Share Your Feedback</h1><p>Help us improve CyberRakshak by sharing your thoughts</p></div>
      <div className="feedback-content">
        <div className="feedback-intro"><p>Your feedback is valuable and helps us provide better cyber security education. Please take a moment to share your experience using CyberRakshak.</p></div>
        <form onSubmit={handleSubmit} className="feedback-form">
          <section className="form-section">
            <h2>Rate Your Experience</h2><p className="section-description">How would you rate your overall experience with CyberRakshak?</p>
            <div className="rating-container"><div className="stars">{[1,2,3,4,5].map((star) => <button key={star} type="button" className={`star ${star <= (hoveredRating || formData.rating) ? "filled" : ""}`} onClick={() => handleRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} title={`Rate ${star} stars`}>★</button>)}</div><span className="rating-label">{getRatingLabel(hoveredRating || formData.rating)}</span></div>
            {!formData.rating && <p className="required-message">Please rate your experience</p>}
          </section>
          <section className="form-section"><h2>Feedback Category</h2><p className="section-description">What aspect would you like to provide feedback on?</p><div className="category-grid">{categories.map((cat) => <label key={cat.value} className="category-option"><input type="radio" name="category" value={cat.value} checked={formData.category === cat.value} onChange={handleChange}/><span className="category-icon">{cat.icon}</span><span className="category-label">{cat.label}</span></label>)}</div></section>
          <section className="form-section"><h2>Your Comments</h2><p className="section-description">Please share your detailed feedback (minimum 10 characters)</p><textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Share your thoughts, suggestions, or issues you encountered..." rows="6" minLength="10" maxLength="1000" required /><span className="char-count">{formData.comments.length}/1000 characters</span></section>
          <section className="form-section"><h2>Contact Information (Optional)</h2><p className="section-description">Leave your contact details if you'd like us to follow up on your feedback</p><div className="form-row"><div className="form-group"><label htmlFor="userName">Name</label><input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder="Your name" maxLength="100" /></div><div className="form-group"><label htmlFor="userEmail">Email</label><input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="your@email.com" maxLength="254" /></div></div></section>
          {submitError && <p role="alert" className="required-message">{submitError}</p>}
          <button type="submit" className="submit-btn" disabled={!formData.rating || formData.comments.trim().length < 10 || isLoading}>{isLoading ? "Submitting..." : "Submit Feedback"}</button>
        </form>
        <section className="faq-section"><h2>❓ Frequently Asked Questions</h2><div className="faq-grid"><div className="faq-card"><h3>How is my feedback used?</h3><p>Your feedback helps us understand user needs and improve our content, features, and overall experience.</p></div><div className="faq-card"><h3>Is my feedback confidential?</h3><p>Feedback is stored by CyberRakshak for product improvement and administrative review.</p></div><div className="faq-card"><h3>Will I get a response?</h3><p>If you provide contact information, the team may follow up when clarification is useful.</p></div><div className="faq-card"><h3>How often can I submit feedback?</h3><p>You can submit feedback whenever you have useful suggestions or observations.</p></div></div></section>
      </div>
    </div>
  );
}

export default Feedback;
