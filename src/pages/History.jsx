import "./History.css";

export default function History() {
  // Dummy quiz history data (you can replace with real data later)
  const historyData = [
    { id: 1, title: "JavaScript Basics", score: "9/10", date: "12 Nov 2025" },
    { id: 2, title: "Computer Networks", score: "7/10", date: "10 Nov 2025" },
    { id: 3, title: "Data Structures", score: "8/10", date: "08 Nov 2025" },
  ];

  return (
    <div className="history-container">
      <h1 className="history-title">Quiz History</h1>

      <div className="history-list">
        {historyData.map((item) => (
          <div key={item.id} className="history-card">
            <h3 className="history-quiz-title">{item.title}</h3>
            <p className="history-score">Score: {item.score}</p>
            <p className="history-date">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
