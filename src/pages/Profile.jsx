import "./Profile.css";

export default function Profile() {
  return (
    <div className="profile-container">

      {/* PAGE TITLE */}
      <h1 className="profile-title">Your Profile</h1>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span className="material-symbols-rounded">person</span>
        </div>

        <h2 className="profile-name">John Doe</h2>
        <p className="profile-email">johndoe@example.com</p>

        <button className="edit-btn">
          <span className="material-symbols-rounded">edit</span>
          Edit Profile
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Quizzes Played</h3>
          <p>24</p>
        </div>

        <div className="stat-card">
          <h3>Average Score</h3>
          <p>82%</p>
        </div>

        <div className="stat-card">
          <h3>Best Score</h3>
          <p>10 / 10</p>
        </div>
      </div>

    </div>
  );
}
