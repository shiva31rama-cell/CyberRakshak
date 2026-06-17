import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Learn.css";

function Learn() {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const modules = [
    {
      id: 1,
      title: "Digital Literacy Basics",
      icon: "📱",
      difficulty: "beginner",
      description: "Learn the basics of digital literacy and internet safety",
      lessons: 5,
      duration: "30 mins",
      link: "/digital-literacy",
      completed: false,
    },
    {
      id: 2,
      title: "Password Security",
      icon: "🔐",
      difficulty: "beginner",
      description: "Master the art of creating and managing strong passwords",
      lessons: 6,
      duration: "25 mins",
      link: "/password-security",
      completed: false,
    },
    {
      id: 3,
      title: "UPI & Payment Safety",
      icon: "💳",
      difficulty: "beginner",
      description: "Secure your digital payments and understand UPI safety",
      lessons: 8,
      duration: "35 mins",
      link: "/upi-safety",
      completed: false,
    },
    {
      id: 4,
      title: "Social Media Safety",
      icon: "💬",
      difficulty: "intermediate",
      description: "Stay safe while using social media platforms",
      lessons: 7,
      duration: "30 mins",
      link: "/social-media-safety",
      completed: false,
    },
    {
      id: 5,
      title: "Cyber Crime Awareness",
      icon: "🚨",
      difficulty: "intermediate",
      description: "Understand common cyber crimes and how to protect yourself",
      lessons: 6,
      duration: "28 mins",
      link: "/cyber-crime-awareness",
      completed: false,
    },
    {
      id: 6,
      title: "Emergency Response",
      icon: "🆘",
      difficulty: "advanced",
      description: "Know what to do in a cyber security emergency",
      lessons: 4,
      duration: "20 mins",
      link: "/emergency-help",
      completed: false,
    },
  ];

  const filteredModules =
    selectedDifficulty === "all"
      ? modules
      : modules.filter((module) => module.difficulty === selectedDifficulty);

  const completedModules = modules.filter((m) => m.completed).length;
  const completionPercentage = Math.round(
    (completedModules / modules.length) * 100,
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "#4caf50";
      case "intermediate":
        return "#f57c00";
      case "advanced":
        return "#f44336";
      default:
        return "#667eea";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="learn-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {/* Header */}
      <div className="learn-header">
        <h1>📚 Learning Center</h1>
        <p>Master cyber security with our comprehensive courses</p>
      </div>

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-card">
          <h3>Your Learning Progress</h3>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-label">Modules Completed</span>
              <span className="stat-value">{completedModules}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Modules</span>
              <span className="stat-value">{modules.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completion</span>
              <span className="stat-value">{completionPercentage}%</span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {completionPercentage === 100
                ? "🎉 You've completed all modules!"
                : `Keep learning! ${modules.length - completedModules} modules remaining`}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <h3>Filter by Level</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedDifficulty === "all" ? "active" : ""}`}
            onClick={() => setSelectedDifficulty("all")}
          >
            All Levels ({modules.length})
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "beginner" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("beginner")}
          >
            🟢 Beginner (
            {modules.filter((m) => m.difficulty === "beginner").length})
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "intermediate" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("intermediate")}
          >
            🟡 Intermediate (
            {modules.filter((m) => m.difficulty === "intermediate").length})
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "advanced" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("advanced")}
          >
            🔴 Advanced (
            {modules.filter((m) => m.difficulty === "advanced").length})
          </button>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="modules-section">
        <div className="modules-grid">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => navigate(module.link)}
            >
              <div className="module-header">
                <span className="module-icon">{module.icon}</span>
                <span
                  className="module-difficulty"
                  style={{
                    backgroundColor: getDifficultyColor(module.difficulty),
                  }}
                >
                  {getDifficultyLabel(module.difficulty)}
                </span>
              </div>

              <h3>{module.title}</h3>
              <p className="module-description">{module.description}</p>

              <div className="module-meta">
                <span className="meta-item">📖 {module.lessons} Lessons</span>
                <span className="meta-item">⏱️ {module.duration}</span>
              </div>

              {module.completed && (
                <div className="completion-badge">✅ Completed</div>
              )}

              <button className="module-btn">Start Learning</button>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="no-modules">
            <p>No modules found for selected level</p>
          </div>
        )}
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <h2>💡 Learning Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📖</span>
            <h4>Read Carefully</h4>
            <p>Take your time to read and understand each lesson thoroughly</p>
          </div>

          <div className="tip-card">
            <span className="tip-icon">✏️</span>
            <h4>Take Notes</h4>
            <p>Write down important points to help you remember better</p>
          </div>

          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Complete Quizzes</h4>
            <p>Test your knowledge with quizzes to reinforce learning</p>
          </div>

          <div className="tip-card">
            <span className="tip-icon">🔄</span>
            <h4>Review Regularly</h4>
            <p>Revisit modules to refresh your memory and stay updated</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Learn;
