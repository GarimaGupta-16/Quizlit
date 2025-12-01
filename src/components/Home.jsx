import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import createIcon from "../assets/CreateQuiz.png";
import joinIcon from "../assets/Join.png";
import randomIcon from "../assets/Random.png";
import aiIcon from "../assets/AI_generated.png";

export default function Home() {
  const navigate = useNavigate();

  // 🔊 CLICK SOUND (ALWAYS 2 SECONDS)
  const clickSound = useRef(new Audio("/sounds/click.wav"));

  const playClick = () => {
    const audio = clickSound.current;

    audio.pause();
    audio.currentTime = 0;

    // Skip the first 0 seconds (optional trimming)
    audio.currentTime = 0.1;

    audio.play();

    // Force stop at 2 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2000);
  };

  // Wrapper function: plays click then navigates
  const navigateWithSound = (path) => {
    playClick();
    setTimeout(() => navigate(path), 150); // small delay feels natural
  };

  return (
    <div className="home-container">
      <h1 className="main-title">QuizLit</h1>

      <div className="cards-container">

        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={createIcon} alt="Create Quiz" className="card-icon" />
          </div>

          <button
            className="card-button"
            onClick={() => navigateWithSound("/create-quiz")}
          >
            Create Quiz
          </button>
        </div>

        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={joinIcon} alt="Join Quiz" className="card-icon" />
          </div>

          <button
            className="card-button"
            onClick={() => navigateWithSound("/join-quiz")}
          >
            Join Quiz
          </button>
        </div>

        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={randomIcon} alt="Play Random Quiz" className="card-icon" />
          </div>

          <button
            className="card-button"
            onClick={() => navigateWithSound("/random-quiz")}
          >
            Play Random Quiz
          </button>
        </div>

      </div>

      <div className="cards-container bottom-row">
        <div className="quiz-card">
          <div className="card-icon-wrapper">
            <img src={aiIcon} alt="AI Quiz" className="card-icon" />
          </div>

          <button
            className="card-button"
            onClick={() => navigateWithSound("/ai-quiz")}
          >
            Play AI-Gen Quiz
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 QuizLit. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
