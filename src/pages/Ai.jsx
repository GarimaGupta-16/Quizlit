  import React, { useEffect, useRef, useState } from "react";
  import "./Ai.css";

  function decodeHTMLEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }

  export default function Ai() {
    // --------------------
    // SOUND HANDLERS
    // --------------------
    const clickSound = useRef(new Audio("/sounds/click.wav"));
    const nextSound = useRef(new Audio("/sounds/click.wav"));
    const leaderboardSound = useRef(new Audio("/sounds/leaderboard.wav"));

    // FORCE ALL SOUNDS TO 2 SECONDS
    function playTrimmed(audioRef, startAt = 0) {
      const audio = audioRef.current;
      audio.currentTime = startAt; // skip first X seconds
      audio.play().catch(() => {});

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 2000); // Stop after EXACT 2 seconds
    }

    const playClick = () => playTrimmed(clickSound, 0);
    const playNext = () => playTrimmed(nextSound, 1);   // Skip first 1 sec
    const playLeaderboard = () => playTrimmed(leaderboardSound, 0);


    // ----------------------------------------
    // AI QUIZ LOGIC (your existing code below)
    // ----------------------------------------

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
            playNext(); // AUTO NEXT SOUND
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

      if (currentIndex >= questions.length - 1) {
        computeAndFinish();
      } else {
        playNext();
        setCurrentIndex((i) => i + 1);
      }
    }

    async function generateQuiz(e) {
      e.preventDefault();
      playClick();
      setLoading(true);
      setError("");

      const categoryId = categoryMap[topic] || 9;
      const amount = Math.min(50, numQuestions);

      const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Request Failed: ${response.status}`);

        const data = await response.json();
        if (data.response_code !== 0)
          throw new Error("API limit or invalid filters.");

        const normalized = data.results.map((item, idx) => {
          const options = [
            decodeHTMLEntities(item.correct_answer),
            ...item.incorrect_answers.map(decodeHTMLEntities),
          ];

          // Shuffle
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
        setError(err.message);
        setQuestions([]);
        setStatus("config");
      }

      setLoading(false);
    }

    function selectOption(option) {
      playClick();
      const q = questions[currentIndex];
      if (!q) return;
      setAnswers((prev) => ({ ...prev, [q.id]: option }));
    }

    function goNext() {
      playNext();
      clearTimer();
      handleAutoAdvance();
    }

    function goPrev() {
      playClick();
      clearTimer();
      if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    }

    function computeAndFinish() {
      clearTimer();
      playLeaderboard();

      const all = { ...answers };
      questions.forEach((q) => {
        if (all[q.id] === undefined) all[q.id] = null;
      });

      let s = 0;
      questions.forEach((q) => {
        if (q.answer && all[q.id] === q.answer) s++;
      });

      setAnswers(all);
      setScore(s);
      setStatus("finished");
    }

    function startReview() {
      playClick();
      setStatus("review");
    }

    function restart() {
      playClick();
      clearTimer();
      setQuestions([]);
      setAnswers({});
      setCurrentIndex(0);
      setScore(0);
      setStatus("config");
      setError("");
    }

    const currentQuestion = questions[currentIndex];

    // ---------- UI BELOW (unchanged except onclick sound hooks -----------

    return (
      <div className="solo-ai-root">
        {/* CONFIG UI */}
        {status === "config" && (
          <div className="solo-card config">
            <div className="header">
              <h1>AI — Solo Quiz</h1>
              <p className="sub">Generated from the OpenTDB API.</p>
            </div>

            <form className="config-form" onSubmit={generateQuiz}>
              <label className="field">
                <span className="label">Topic</span>
                <select
                  value={topic}
                  onChange={(e) => {
                    playClick();
                    setTopic(e.target.value);
                  }}
                >
                  {Object.keys(categoryMap).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <div className="grid-2">
                <label className="field">
                  <span className="label">Time per question</span>
                  <select
                    value={timePerQuestion}
                    onChange={(e) => {
                      playClick();
                      setTimePerQuestion(e.target.value);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </label>

                <label className="field">
                  <span className="label">Number of questions</span>
                  <select
                    value={numQuestions}
                    onChange={(e) => {
                      playClick();
                      setNumQuestions(e.target.value);
                    }}
                  >
                    {[5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="actions">
                <button className="primary" type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Generate & Start"}
                </button>
              </div>

              {error && <div className="error">{error}</div>}
            </form>
          </div>
        )}

        {/* RUNNING QUIZ */}
        {status === "running" && currentQuestion && (
          <div className="solo-card quiz">
            <div className="quiz-header">
              <div className="meta">
                <div className="topic-pill">{topic}</div>
                <div className="progress-pill">{currentIndex + 1}/{questions.length}</div>
              </div>
                <div className="timer-wrap">
    <svg className={`timer-ring ${timeLeft <= 5 ? "critical" : ""}`} viewBox="0 0 36 36">
      <path
        className="timer-bg"
        d="M18 2
           a 16 16 0 0 1 0 32
           a 16 16 0 0 1 0 -32"
      />
      <path
        className="timer-fg"
        strokeDasharray={`${(timeLeft / timePerQuestion) * 100}, 100`}
        d="M18 2
           a 16 16 0 0 1 0 32
           a 16 16 0 0 1 0 -32"
      />
    </svg>

    <div className="time-text">{timeLeft}</div>
  </div>

            </div>

            <div className="question-area">
              <h2>{currentQuestion.q}</h2>

              <div className="options">
                {currentQuestion.options.map((opt, i) => {
                  const selected = answers[currentQuestion.id] === opt;
                  return (
                    <button
                      key={i}
                      className={selected ? "option selected" : "option"}
                      onClick={() => selectOption(opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="nav-row">
                <button onClick={goPrev} className="ghost" disabled={currentIndex === 0}>
                  Previous
                </button>

                <button
                  className="primary"
                  onClick={goNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {status === "finished" && (
          <div className="solo-card results">
            <h2>Leaderboard — Solo</h2>
            <div className="score-card">
              <div className="score-big">{score}</div>
              <div className="score-small">/ {questions.length}</div>
            </div>

            <div className="result-actions">
              <button className="primary" onClick={startReview}>Review</button>
              <button className="ghost" onClick={restart}>Try Another</button>
            </div>
          </div>
        )}

        {/* REVIEW SCREEN */}
        {status === "review" && (
          <div className="solo-card review">
            <h2>Review Answers</h2>

            {questions.map((q, idx) => (
              <div key={idx} className="review-question-block">
                <div className="review-q-text">{q.q}</div>
                <div className="review-options">
                  {q.options.map((opt, i) => {
                    const correct = opt === q.answer;
                    const userAns = answers[q.id];
                    return (
                      <div
                        key={i}
                        className={
                          correct ? "review-option correct"
                          : userAns === opt ? "review-option wrong"
                          : "review-option"
                        }
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button className="primary" onClick={restart}>Restart</button>
          </div>
        )}
      </div>
    );
  }
