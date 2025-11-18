import React from "react";
import "./Profile.css";
import avatarImg from "../assets/avatar.jpg"; 

export default function Profile() {
  return (
    <div className="profile-page">
      {/* TOP PROFILE CARD */}
      <div className="profile-top-card">
        
        <div className="avatar-wrapper">
          <img 
            src={avatarImg} 
            alt="User Avatar" 
            className="avatar-img" 
          />
        </div>

        <div className="user-info">
          <h1 className="user-name">John Doe</h1>
          <p className="user-handle">@johndoe123</p>
          <p className="user-email">johndoe@example.com</p>

          <div className="action-row">
            <button className="edit-btn">✎ Edit Profile</button>
            <button className="share-btn">⤴ Share</button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <h2 className="section-heading">Your Stats</h2>
      <div className="stats-container">
        <div className="stats-card horror-hover">
          <span className="material-symbols-rounded stats-icon">quiz</span>
          <div className="stats-meta">
            <div className="stats-value">156</div>
            <div className="stats-label">Quizzes Played</div>
          </div>
        </div>

        <div className="stats-card horror-hover">
          <span className="material-symbols-rounded stats-icon">insights</span>
          <div className="stats-meta">
            <div className="stats-value">89%</div>
            <div className="stats-label">Accuracy</div>
          </div>
        </div>

        <div className="stats-card horror-hover">
          <span className="material-symbols-rounded stats-icon">whatshot</span>
          <div className="stats-meta">
            <div className="stats-value">25d</div>
            <div className="stats-label">Current Streak</div>
          </div>
        </div>

        <div className="stats-card horror-hover">
          <span className="material-symbols-rounded stats-icon">military_tech</span>
          <div className="stats-meta">
            <div className="stats-value">98%</div>
            <div className="stats-label">Best Score</div>
          </div>
        </div>
      </div>

      {/* BADGES */}
      <h2 className="section-heading">Badges & Achievements</h2>
      <div className="badge-container">
        <div className="badge-card gold horror-shake">
          <span className="material-symbols-rounded badge-icon">workspace_premium</span>
          <div className="badge-label">Gold Achiever</div>
        </div>

        <div className="badge-card purple horror-shake">
          <span className="material-symbols-rounded badge-icon">auto_awesome</span>
          <div className="badge-label">Streak Master</div>
        </div>

        <div className="badge-card blue horror-shake">
          <span className="material-symbols-rounded badge-icon">rocket_launch</span>
          <div className="badge-label">Speed Thinker</div>
        </div>

        <div className="badge-card mint horror-shake">
          <span className="material-symbols-rounded badge-icon">emoji_events</span>
          <div className="badge-label">Top Performer</div>
        </div>
      </div>
    </div>
  );
}