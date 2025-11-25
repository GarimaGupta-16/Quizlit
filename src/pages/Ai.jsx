import React, { useEffect, useRef, useState } from "react";
import "./Ai.css";


function decodeHTMLEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
}

export default function Ai() {
  
  const [topic, setTopic] = useState("Science: Computers");
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [numQuestions, setNumQuestions] = useState(10);
  const [categoryMap] = useState({
    "General Knowledge": 9,
    "Entertainment: Books": 10,
    "Entertainment: Film": 11,
    "Entertainment: Music": 12,
    "Entertainment: Television": 14,
    "Science & Nature": 17,
    "Science: Computers": 18,
    Mythology: 20,
    Sports: 21,
    Geography: 22,
    History: 23,
    Politics: 24,
    Art: 25,
    Animals: 27,
    Vehicles: 28,
  });

  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("config"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const timerRef = useRef(null);

  
  const [score, setScore] = useState(0);

  useEffect(() => setTimeLeft(Number(timePerQuestion)), [timePerQuestion]);

  useEffect(() => {
    if (status === "running") startTimerFor(currentIndex);
    else clearTimer();

    return () => clearTimer();
  }, [status, currentIndex]);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimerFor(index) {
    clearTimer();
    setTimeLeft(Number(timePerQuestion));

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          handleAutoAdvance();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleAutoAdvance() {
    const q = questions[currentIndex];
    if (!q) return;

    setAnswers((prev) => {
      if (prev[q.id] === undefined) return { ...prev, [q.id]: null };
      return prev;
    });

    if (currentIndex >= questions.length - 1) computeAndFinish();
    else setCurrentIndex((i) => i + 1);
  }

  async function generateQuiz(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const categoryId = categoryMap[topic] || 9;
    const amount = Math.min(50, numQuestions);

    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API Request Failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error(
          `API returned response code ${data.response_code}. Try a different number of questions or topic.`
        );
      }

      if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error(
          "No questions found for this topic/number combination."
        );
      }

      const normalized = data.results.map((item, idx) => {
        const options = [
          decodeHTMLEntities(item.correct_answer),
          ...item.incorrect_answers.map(decodeHTMLEntities),
        ];

      
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        return {
          id: idx + 1,
          q: decodeHTMLEntities(item.question),
          options,
          answer: decodeHTMLEntities(item.correct_answer),
        };
      });

      setQuestions(normalized);
      setCurrentIndex(0);
      setAnswers({});
      setStatus("running");
    } catch (err) {
      console.error("Quiz generation error:", err.message);
      setError(err.message);
      setQuestions([]);
      setStatus("config");
    }

    setLoading(false);
  }

  function selectOption(option) {
    const q = questions[currentIndex];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  }

  function goNext() {
    clearTimer();
    handleAutoAdvance();
  }

  function goPrev() {
    clearTimer();
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function computeAndFinish() {
    clearTimer();

    const allAnswers = { ...answers };
    questions.forEach((q) => {
      if (allAnswers[q.id] === undefined) allAnswers[q.id] = null;
    });

    let s = 0;
    questions.forEach((q) => {
      if (q.answer && allAnswers[q.id] === q.answer) s++;
    });

    setAnswers(allAnswers);
    setScore(s);
    setStatus("finished");
  }

  function startReview() {
    setStatus("review");
  }

  function restart() {
    clearTimer();
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setStatus("config");
    setError("");
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="solo-ai-root">
      
      {status === "config" && (
        <div className="solo-card config">
          <div className="header">
            <h1>AI — Solo Quiz</h1>
            <p className="sub">
              Quiz generated from the Open Trivia Database API.
            </p>
          </div>

          <form className="config-form" onSubmit={generateQuiz}>
            <label className="field">
              <span className="label">Topic / Category</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              >
                {Object.keys(categoryMap).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid-2">
              <label className="field">
                <span className="label">Time per question</span>
                <select
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(e.target.value)}
                >
                  <option value="10">10s</option>
                  <option value="15">15s</option>
                  <option value="20">20s</option>
                  <option value="30">30s</option>
                </select>
              </label>

              <label className="field">
                <span className="label">Number of questions</span>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                >
                  {[5, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="actions">
              <button type="submit" className="primary" disabled={loading}>
                {loading ? "Fetching Questions..." : "Generate & Start"}
              </button>
            </div>

            {error && <div className="error">{error}</div>}
            <small className="api-note">
              Note: OpenTDB provides fixed categories and a maximum of 50
              questions.
            </small>
          </form>
        </div>
      )}

      
      {status === "running" && currentQuestion && (
        <div className="solo-card quiz">
          <div className="quiz-header">
            <div className="meta">
              <div className="topic-pill">{topic || "General"}</div>
              <div className="progress-pill">
                {currentIndex + 1} / {questions.length}
              </div>
            </div>

            <div className="timer-wrap">
              <div className="timer">
                <svg
                  viewBox="0 0 36 36"
                  className={`timer-ring ${
                    timeLeft <= 5 ? "critical" : ""
                  }`}
                >
                  <path
                    className="timer-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="timer-fg"
                    strokeDasharray={`${(timeLeft /
                      Math.max(1, timePerQuestion)) *
                      100}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="time-text">{timeLeft}s</div>
              </div>
            </div>
          </div>

          <div className="question-area">
            <div className="q-head">
              <div className="q-index">Q{currentIndex + 1}</div>
              <div className="q-text">{currentQuestion.q}</div>
            </div>

            <div className="options">
              {currentQuestion.options.map((opt, i) => {
                const selected = answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={i}
                    className={`option ${selected ? "selected" : ""}`}
                    onClick={() => selectOption(opt)}
                  >
                    <span className="opt-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="nav-row">
              <button
                className="ghost"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              <div className="small-actions">
                <button
                  className="skip ghost"
                  onClick={() => {
                    const q = currentQuestion;
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: prev[q.id] ?? null,
                    }));
                    goNext();
                  }}
                >
                  Skip
                </button>

                <button
                  className="primary"
                  onClick={goNext}
                  disabled={answers[currentQuestion.id] === undefined}
                >
                  {currentIndex === questions.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    
      {status === "finished" && (
        <div className="solo-card results">
          <div className="result-head">
            <h2>Leaderboard — Solo</h2>
            <p className="sub">Here is your final score!</p>
          </div>

          <div className="score-card">
            <div className="score-big">{score}</div>
            <div className="score-small">
              / {questions.length} •{" "}
              {Math.round((score / questions.length) * 100)}%
            </div>
          </div>

          <div className="result-actions">
            <button className="primary" onClick={startReview}>
              Review Answers
            </button>
            <button className="ghost" onClick={restart}>
              Try Another Topic
            </button>
          </div>
        </div>
      )}

      
      {status === "review" && (
        <div className="solo-card review">
          <div className="review-head">
            <h2>Review Answers</h2>
            <p className="sub">See what you got correct or wrong.</p>
          </div>

          <div className="review-list">
            {questions.map((q, idx) => {
              const userAns = answers[q.id];
              const correct = q.answer;

              return (
                <div key={q.id} className="review-question-block">
                  <div className="review-q-index">{idx + 1}</div>

                  <div className="review-q-text">{q.q}</div>

                  <div className="review-options">
                    {q.options.map((opt, i) => {
                      let className = "review-option";

                      if (opt === correct) className += " correct";
                      if (opt === userAns && userAns !== correct)
                        className += " wrong";

                      return (
                        <div key={i} className={className}>
                          <span className="letter">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            <button className="primary" onClick={restart}>
              New Quiz
            </button>
            <button className="ghost" onClick={() => setStatus("finished")}>
              Back to Score
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
