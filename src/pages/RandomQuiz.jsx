import React, { useEffect, useState } from "react";
import "./RandomQuiz.css";

export default function RandomQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [animate, setAnimate] = useState(false); // Controls fade-in/out of card

  // 50-question bank (same as your previous one)
  const questionBank = [
   { q: "Capital of India?", options: ["Delhi", "Mumbai", "Kolkata", "Chennai"], answer: "Delhi" },
   { q: "Fastest land animal?", options: ["Cheetah", "Lion", "Horse", "Tiger"], answer: "Cheetah" },
   { q: "Largest planet?", options: ["Jupiter", "Mars", "Venus", "Earth"], answer: "Jupiter" },
   { q: "Who invented the telephone?", options: ["Bell", "Edison", "Tesla", "Newton"], answer: "Bell" },
   { q: "National bird of India?", options: ["Peacock", "Sparrow", "Crow", "Eagle"], answer: "Peacock" },
   { q: "Chemical symbol of water?", options: ["H₂O", "O₂", "CO₂", "N₂"], answer: "H₂O" },
   { q: "Tallest mountain?", options: ["Everest", "K2", "Kangchenjunga", "Makalu"], answer: "Everest" },
   { q: "Planet known as Red Planet?", options: ["Mars", "Venus", "Mercury", "Saturn"], answer: "Mars" },
   { q: "Who wrote Harry Potter?", options: ["J.K. Rowling", "Tolkein", "Shakespeare", "Lewis"], answer: "J.K. Rowling" },
   { q: "Smallest continent?", options: ["Australia", "Europe", "Asia", "Africa"], answer: "Australia" },
   { q: "Which gas do plants absorb?", options: ["CO₂", "Oxygen", "Nitrogen", "Hydrogen"], answer: "CO₂" },
   { q: "Largest ocean?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], answer: "Pacific" },
   { q: "Currency of Japan?", options: ["Yen", "Won", "Dollar", "Euro"], answer: "Yen" },
   { q: "Who painted Mona Lisa?", options: ["Da Vinci", "Picasso", "Van Gogh", "Raphael"], answer: "Da Vinci" },
   { q: "Square root of 64?", options: ["8", "6", "7", "9"], answer: "8" },
   { q: "Largest mammal?", options: ["Blue Whale", "Elephant", "Shark", "Giraffe"], answer: "Blue Whale" },
   { q: "National animal of India?", options: ["Tiger", "Lion", "Elephant", "Leopard"], answer: "Tiger" },
   { q: "Which planet has rings?", options: ["Saturn", "Mars", "Earth", "Venus"], answer: "Saturn" },
   { q: "Speed of light?", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁴ m/s", "3×10¹⁰ m/s"], answer: "3×10⁸ m/s" },
   { q: "Largest desert?", options: ["Sahara", "Gobi", "Arabian", "Thar"], answer: "Sahara" },
   { q: "Father of computers?", options: ["Charles Babbage", "Newton", "Darwin", "Einstein"], answer: "Charles Babbage" },
   { q: "Metal that is liquid at room temp?", options: ["Mercury", "Gold", "Iron", "Silver"], answer: "Mercury" },
   { q: "Which animal lays eggs?", options: ["Platypus", "Tiger", "Whale", "Elephant"], answer: "Platypus" },
   { q: "Which is a prime number?", options: ["17", "21", "25", "27"], answer: "17" },
   { q: "Sun rises in the?", options: ["East", "West", "North", "South"], answer: "East" },
   { q: "Binary of 5?", options: ["101", "110", "100", "111"], answer: "101" },
   { q: "Which organ pumps blood?", options: ["Heart", "Lungs", "Liver", "Brain"], answer: "Heart" },
   { q: "India's national flower?", options: ["Lotus", "Rose", "Sunflower", "Tulip"], answer: "Lotus" },
   { q: "First man on Moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Kalpana Chawla"], answer: "Neil Armstrong" },
   { q: "Largest island?", options: ["Greenland", "Iceland", "Madagascar", "Sumatra"], answer: "Greenland" },
   { q: "Which shape has 3 sides?", options: ["Triangle", "Circle", "Square", "Pentagon"], answer: "Triangle" },
   { q: "Hardest natural substance?", options: ["Diamond", "Iron", "Gold", "Platinum"], answer: "Diamond" },
   { q: "Which animal is known as King of Jungle?", options: ["Lion", "Tiger", "Wolf", "Bear"], answer: "Lion" },
   { q: "Hottest planet?", options: ["Venus", "Mercury", "Mars", "Jupiter"], answer: "Venus" },
   { q: "Which gas do humans exhale?", options: ["CO₂", "O₂", "He", "N₂"], answer: "CO₂" },
   { q: "Which planet is closest to Sun?", options: ["Mercury", "Earth", "Mars", "Venus"], answer: "Mercury" },
   { q: "What is HCl?", options: ["Acid", "Base", "Salt", "Sugar"], answer: "Acid" },
   { q: "Tallest animal?", options: ["Giraffe", "Elephant", "Horse", "Kangaroo"], answer: "Giraffe" },
   { q: "Which organ helps in breathing?", options: ["Lungs", "Heart", "Kidney", "Brain"], answer: "Lungs" },
   { q: "Colors in rainbow?", options: ["7", "5", "6", "8"], answer: "7" },
   { q: "Planet known as Morning Star?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: "Venus" },
   { q: "Largest bone in body?", options: ["Femur", "Rib", "Skull", "Humerus"], answer: "Femur" },
   { q: "How many seconds in 1 minute?", options: ["60", "100", "30", "90"], answer: "60" },
   { q: "National sport of India?", options: ["Hockey", "Cricket", "Football", "Kabaddi"], answer: "Hockey" },
   { q: "How many states in India?", options: ["28", "29", "27", "30"], answer: "28" },
   { q: "First President of India?", options: ["Dr. Rajendra Prasad", "Nehru", "Patel", "Gandhi"], answer: "Dr. Rajendra Prasad" },
   { q: "Earth is shaped like?", options: ["Sphere", "Cube", "Cone", "Flat"], answer: "Sphere" },
   { q: "Which blood group is universal donor?", options: ["O−", "O+", "AB+", "A−"], answer: "O−" },
   { q: "Which animal is the largest reptile?", options: ["Crocodile", "Lizard", "Snake", "Turtle"], answer: "Crocodile" }
 ];

  const startNewQuiz = () => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnimate(true);
  };
  
  // Initial load
  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleSelect = (option) => {
    // Only allow selection if the quiz is not finished
    if (!finished) {
      setSelected(option);
    }
  };

  const nextQuestion = () => {
    if (selected === null) return; // Must select an answer

    if (selected === questions[currentQ].answer) {
      setScore(s => s + 1);
    }

    // Animate exit -> enter
    setAnimate(false);

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setAnimate(true);
      } else {
        setFinished(true);
      }
    }, 300);
  };
  
  const progressPercent = (currentQ / questions.length) * 100;

  if (questions.length === 0) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="random-quiz-page">

      {!finished ? (
        <>
          <h1 className="quiz-title">🎲 Random Knowledge Quiz</h1>
          <p className="subtitle">Question {currentQ + 1} of {questions.length} | Score: {score}</p>
          
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className={`question-card single fade-card ${animate ? "fade-in" : "fade-out"}`}>
            
            <h2 className="question-text">
              <span className="question-number">{currentQ + 1}.</span> {questions[currentQ].q}
            </h2>

            <div className="options-grid">
              {questions[currentQ].options.map((opt) => (
                <button
                  key={opt}
                  className={`option-btn single-option bounce-on-hover 
                    ${selected === opt ? "selected" : ""}
                  `}
                  onClick={() => handleSelect(opt)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            className={`next-btn ${selected ? "active bounce-on-hover" : ""}`}
            onClick={nextQuestion}
            disabled={selected === null}
          >
            {currentQ === questions.length - 1 ? "Finish Quiz →" : "Next Question →"}
          </button>
        </>
      ) : (
        <div className="result-box final pop-in">
          <span className="material-symbols-rounded trophy-icon">emoji_events</span>
          <h2>Quiz Complete!</h2>
          <p className="final-score-text">Final Score: <span className="score-value">{score} / {questions.length}</span></p>

          <p className="result-message">
            {score === 5 ? "🔥 Perfect! You've mastered the realm." : score >= 3 ? "👏 Great job! Keep improving!" : "💡 Try again — learning never stops!"}
          </p>

          <button className="restart-btn bounce-on-hover" onClick={startNewQuiz}>
            Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}