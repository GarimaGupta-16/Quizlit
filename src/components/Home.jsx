import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'
import createIcon from "../assets/CreateQuiz.png";
import joinIcon from "../assets/Join.png";
import randomIcon from "../assets/Random.png";
import aiIcon from "../assets/AI_generated.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="main-title">QuizLit</h1>

      <div className="cards-container">
        
        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={createIcon} alt="Create Quiz" className="card-icon" />
          </div>
          {/* Added navigation on click */}
          <button 
            className="card-button" 
            onClick={() => navigate('/create-quiz')}
          >
            Create Quiz
          </button>
        </div>

        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={joinIcon} alt="Join Quiz" className="card-icon" />
          </div>
          <button className="card-button"
            onClick={() => navigate('/join-quiz')}
            >Join Quiz</button>
        </div>

        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={randomIcon} alt="Play Random Quiz" className="card-icon" />
          </div>
          <button className="card-button">Play Random Quiz</button>
        </div>
        
      </div>

      <div className="cards-container bottom-row">
        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={aiIcon} alt="AI Quiz" className="card-icon" />
          </div>
          <button className="card-button">AI Battle Quiz</button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 QuizLit. All Rights Reserved.</p>
      </footer>
    </div>
  );
}