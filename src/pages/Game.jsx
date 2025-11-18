import React from "react";
import "./Game.css";

export default function Game() {
  const steps = [
    {
      id: 1,
      icon: "theater_comedy",
      title: "Choose Your Realm",
      desc: "Select a category from our vast library. Horror, Sci-Fi, History, or Random—pick your poison.",
    },
    {
      id: 2,
      icon: "swords", // or 'group'
      title: "Challenge Rivals",
      desc: "Create a room and invite friends, or battle against the AI. Multiplayer chaos awaits.",
    },
    {
      id: 3,
      icon: "timer",
      title: "Beat the Clock",
      desc: "You have 15 seconds per question. Speed yields higher points, but hesitation is fatal.",
    },
    {
      id: 4,
      icon: "military_tech",
      title: "Claim the Throne",
      desc: "Accumulate points, unlock badges, and dominate the global leaderboard.",
    },
  ];

  return (
    <div className="game-guide-container">
      <header className="guide-header">
        <h1 className="guide-title">How to Play</h1>
        <p className="guide-subtitle">
          Master the rules before you enter the arena.
        </p>
      </header>

      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.id} className="step-card horror-hover">
            {/* Giant background number for style */}
            
            
            <div className="icon-wrapper">
              <span className="material-symbols-rounded step-icon horror-shake">
                {step.icon}
              </span>
            </div>
            
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="action-area">
        <button className="start-game-btn">
          <span className="material-symbols-rounded">play_arrow</span>
          Start New Game
        </button>
      </div>
    </div>
  );
}