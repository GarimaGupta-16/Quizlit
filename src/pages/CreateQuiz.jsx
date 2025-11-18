import React, { useState, useEffect } from "react";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [formData, setFormData] = useState({
    topic: "",
    timePerQuestion: "15",
    numQuestions: "10",
  });

  const [lobbyCode, setLobbyCode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    
    // Simulate API delay for "Generating Portal..."
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
      setLobbyCode(code);
      setIsAnimating(false);
    }, 1500);
  };

  // Handle Enter Key to "Join"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lobbyCode && e.key === "Enter") {
        // Here you would navigate to the lobby
        alert(`Entering Lobby ${lobbyCode}...`); 
        // navigate(`/lobby/${lobbyCode}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lobbyCode]);

  return (
    <div className="create-quiz-container">
      {!lobbyCode ? (
        /* --- FORM SECTION --- */
        <div className={`quiz-config-card ${isAnimating ? "fade-out" : ""}`}>
          <div className="card-header">
            <span className="material-symbols-rounded header-icon horror-shake">
              tune
            </span>
            <h1 className="config-title">Configure Realm</h1>
            <p className="config-subtitle">Set the parameters for your battle.</p>
          </div>

          <form onSubmit={handleSubmit} className="quiz-form">
            {/* Topic Input */}
            <div className="form-group">
              <label>Topic / Realm</label>
              <div className="input-wrapper">
                <span className="material-symbols-rounded input-icon">category</span>
                <input
                  type="text"
                  name="topic"
                  placeholder="e.g. Space, Horror, History..."
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="row-group">
              {/* Time Selection */}
              <div className="form-group">
                <label>Time per Question</label>
                <div className="input-wrapper">
                  <span className="material-symbols-rounded input-icon">timer</span>
                  <select
                    name="timePerQuestion"
                    value={formData.timePerQuestion}
                    onChange={handleChange}
                  >
                    <option value="10">10 Seconds</option>
                    <option value="15">15 Seconds</option>
                    <option value="20">20 Seconds</option>
                    <option value="30">30 Seconds</option>
                  </select>
                </div>
              </div>

              {/* Number of Questions */}
              <div className="form-group">
                <label>No. of Questions</label>
                <div className="input-wrapper">
                  <span className="material-symbols-rounded input-icon">format_list_numbered</span>
                  <select
                    name="numQuestions"
                    value={formData.numQuestions}
                    onChange={handleChange}
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="generate-btn" disabled={isAnimating}>
              {isAnimating ? "Summoning Lobby..." : "Create Lobby"}
            </button>
          </form>
        </div>
      ) : (
        /* --- LOBBY CODE DISPLAY --- */
        <div className="lobby-code-card horror-hover">
          <div className="card-header">
            <span className="material-symbols-rounded header-icon success-icon">
              check_circle
            </span>
            <h1 className="config-title">Lobby Created</h1>
            <p className="config-subtitle">Share this code with your rivals.</p>
          </div>

          <div className="code-display-wrapper">
            <div className="code-box">
              {lobbyCode.toString().split("").map((digit, index) => (
                <span key={index} className="code-digit" style={{animationDelay: `${index * 0.1}s`}}>
                  {digit}
                </span>
              ))}
            </div>
          </div>

          <div className="instruction-text">
            <span className="blink-text">Press <strong>ENTER</strong> to join</span>
          </div>
          
          <div className="lobby-details-preview">
            <span>{formData.topic || "Random"}</span> • <span>{formData.numQuestions} Qs</span> • <span>{formData.timePerQuestion}s</span>
          </div>
        </div>
      )}
    </div>
  );
}