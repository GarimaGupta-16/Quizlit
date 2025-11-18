import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinQuiz.css";

export default function JoinQuiz() {
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // Only allow numbers and max 6 digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
      setError(false); // Reset error on type
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError(true);
      return;
    }

    setIsJoining(true);

    // Simulate API call to join lobby
    setTimeout(() => {
      setIsJoining(false);
      // navigate(`/lobby/${code}`); // Uncomment when lobby route exists
      alert(`Successfully joined lobby: ${code}`);
    }, 1500);
  };

  return (
    <div className="join-quiz-container">
      <div className="join-card">
        <div className="card-header">
          <span className="material-symbols-rounded header-icon floating-icon">
            login
          </span>
          <h1 className="join-title">Enter Portal</h1>
          <p className="join-subtitle">Input the 6-digit code to enter the realm.</p>
        </div>

        <form onSubmit={handleJoin} className="join-form">
          <div className={`code-input-wrapper ${error ? "shake-error" : ""}`}>
            <input
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder="000 000"
              className="code-input"
              maxLength="6"
              autoFocus
            />
            <span className="input-focus-border"></span>
          </div>

          {error && <p className="error-msg">Code must be exactly 6 digits.</p>}

          <button 
            type="submit" 
            className={`join-btn ${isJoining ? "loading" : ""}`}
            disabled={isJoining || code.length === 0}
          >
            {isJoining ? (
              <span className="loading-text">Connecting...</span>
            ) : (
              <>
                <span>Join Lobby</span>
                <span className="material-symbols-rounded btn-icon">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}