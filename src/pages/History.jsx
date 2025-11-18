import React from "react";
import "./History.css";

export default function History() {
  // Example history entries (replace with real data later) 
  const historyData = [
  { id: 1, title: "General Knowledge Quiz", score: "8/10", date: "Feb 12, 2025" },
  { id: 2, title: "Sports Trivia", score: "6/10", date: "Feb 10, 2025" },
  { id: 3, title: "AI Generated Quiz", score: "9/10", date: "Feb 8, 2025" },
  { id: 4, title: "Science & Space Quiz", score: "7/10", date: "Feb 5, 2025" },
  { id: 5, title: "Technology & Coding Basics", score: "10/10", date: "Feb 3, 2025" },
  { id: 6, title: "World Geography Challenge", score: "5/10", date: "Jan 30, 2025" },
  { id: 7, title: "Math Speed Test", score: "9/10", date: "Jan 28, 2025" },
  { id: 8, title: "Movies & Pop Culture", score: "7/10", date: "Jan 24, 2025" },
  { id: 9, title: "History of India Quiz", score: "8/10", date: "Jan 20, 2025" },
  { id: 10, title: "Anime Knowledge Test", score: "6/10", date: "Jan 17, 2025" },
  { id: 11, title: "Logical Reasoning Test", score: "9/10", date: "Jan 12, 2025" },
  { id: 12, title: "English Vocabulary Quiz", score: "10/10", date: "Jan 10, 2025" },
  { id: 13, title: "Computer Hardware Basics", score: "8/10", date: "Jan 7, 2025" },
  { id: 14, title: "Marvel & Superhero Trivia", score: "7/10", date: "Jan 3, 2025" },
  { id: 15, title: "Aptitude Practice Quiz", score: "6/10", date: "Dec 29, 2024" }
];


  

  return (
    <div className="history-container">
      <h1 className="history-title">Quiz History</h1>

      {historyData.length === 0 ? (
        <div className="empty-history">
          <span className="material-symbols-rounded empty-icon">history</span>
          <p>No quiz attempts yet.</p>
          <small>Start your first quiz to see history here!</small>
        </div>
      ) : (
        <div className="history-grid">
          {historyData.map((item) => (
            <div key={item.id} className="history-card">
              <div className="card-header">
                <span className="material-symbols-rounded quiz-icon">
                  quiz
                </span>
                <h3>{item.title}</h3>
              </div>

              <div className="card-details">
                <p><strong>Score:</strong> {item.score}</p>
                <p><strong>Date:</strong> {item.date}</p>
              </div>

              <button className="view-button">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
