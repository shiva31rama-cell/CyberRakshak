import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DigitalLiteracyQuiz.css";

function DigitalLiteracyQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What does OTP stand for?",
      options: [
        "One Time Password",
        "On Time Protocol",
        "Online Transfer Process",
        "Optical Transport Protocol",
      ],
      correct: 0,
      explanation:
        "OTP stands for One Time Password. It is a temporary code sent to your mobile or email for verification.",
    },
    {
      id: 2,
      question: "Which of the following is the MOST secure password?",
      options: ["123456", "Password", "MyP@ss2024!Secure", "qwerty"],
      correct: 2,
      explanation:
        "A secure password should be at least 12 characters long and include uppercase, lowercase, numbers, and special characters.",
    },
    {
      id: 3,
      question: "What is phishing?",
      options: [
        "A type of fishing activity",
        "An attempt to trick you into revealing personal information through fake emails or websites",
        "A new social media platform",
        "A programming technique",
      ],
      correct: 1,
      explanation:
        "Phishing is a cybercrime technique where scammers send fraudulent emails or create fake websites to trick you into revealing personal information.",
    },
    {
      id: 4,
      question:
        "What should you do if you receive a suspicious email asking for your password?",
      options: [
        "Reply with your password to verify your account",
        "Click the link to update your information",
        "Delete the email and never respond to it",
        "Forward it to your friends",
      ],
      correct: 2,
      explanation:
        "Never share your password via email. Legitimate organizations never ask for passwords through email. Always delete suspicious emails.",
    },
    {
      id: 5,
      question: "What is two-factor authentication (2FA)?",
      options: [
        "Using two different passwords",
        "An extra layer of security requiring two forms of verification",
        "Logging in twice",
        "Using two email addresses",
      ],
      correct: 1,
      explanation:
        "2FA adds an extra layer of security by requiring two forms of verification, such as password + OTP, making it harder for hackers to access your account.",
    },
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleAnswerClick = (optionIndex) => {
    if (answered) return;

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeSpent(0);
    setQuizStarted(false);
  };

  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-welcome">
          <h1>📚 Digital Literacy Quiz</h1>
          <p>Test your cyber security knowledge with 5 challenging questions</p>

          <div className="quiz-info">
            <div className="info-card">
              <span className="info-icon">❓</span>
              <p>{questions.length} Questions</p>
            </div>
            <div className="info-card">
              <span className="info-icon">⏱️</span>
              <p>5 Minutes</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🏆</span>
              <p>Pass Score: 70%</p>
            </div>
          </div>

          <div className="quiz-rules">
            <h3>Quiz Rules:</h3>
            <ul>
              <li>✓ You cannot go back to previous questions</li>
              <li>✓ Each question has one correct answer</li>
              <li>✓ Your score will be displayed at the end</li>
              <li>✓ Try to score above 70% to pass</li>
            </ul>
          </div>

          <button className="start-btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
          <button
            className="back-btn"
            onClick={() => navigate("/digital-literacy")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = calculatePercentage();
    const passed = percentage >= 70;

    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div className={`result-badge ${passed ? "passed" : "failed"}`}>
            {passed ? "✅ Passed" : "❌ Try Again"}
          </div>

          <h1>Quiz Complete!</h1>

          <div className="score-display">
            <div className="score-circle">
              <span className="percentage">{percentage}%</span>
              <span className="total">
                {score}/{questions.length}
              </span>
            </div>
          </div>

          <div className="result-message">
            {passed ? (
              <p>
                🎉 Congratulations! You've successfully completed the Digital
                Literacy Quiz!
              </p>
            ) : (
              <p>
                💪 Don't worry! Review the material and try again to improve
                your score.
              </p>
            )}
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-label">Time Spent:</span>
              <span className="stat-value">{formatTime(timeSpent)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Correct Answers:</span>
              <span className="stat-value">
                {score}/{questions.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Pass Percentage:</span>
              <span className="stat-value">{percentage}%</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="restart-btn" onClick={handleRestartQuiz}>
              Retake Quiz
            </button>
            <button
              className="back-btn"
              onClick={() => navigate("/digital-literacy")}
            >
              Go Back
            </button>
          </div>

          {!passed && (
            <div className="improvement-tips">
              <h3>💡 Tips for Improvement:</h3>
              <ul>
                <li>Review the Digital Literacy learning material</li>
                <li>Focus on password security and phishing awareness</li>
                <li>Practice identifying suspicious emails and links</li>
                <li>Learn about two-factor authentication benefits</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="quiz-timer">⏱️ {formatTime(timeSpent)}</div>
        </div>

        <div className="question-section">
          <h2 className="question-text">{question.question}</h2>

          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === index
                    ? index === question.correct
                      ? "correct"
                      : "incorrect"
                    : ""
                } ${answered && index === question.correct ? "show-correct" : ""}`}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {selectedAnswer === index && (
                  <span className="option-indicator">
                    {index === question.correct ? "✓" : "✗"}
                  </span>
                )}
              </button>
            ))}
          </div>

          {answered && (
            <div className="explanation-box">
              <h4>Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <button className="next-btn" onClick={handleNextQuestion}>
            {currentQuestion + 1 === questions.length
              ? "See Results"
              : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}

export default DigitalLiteracyQuiz;
