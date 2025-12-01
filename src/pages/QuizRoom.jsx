// src/components/QuizRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import "./QuizRoom.css";

export default function QuizRoom() {
  const { code } = useParams();
  const { state } = useLocation();
  const socket = useSocket();

  const playerName = state?.playerName;
  const isHost = state?.isHost;

  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const [selected, setSelected] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [locked, setLocked] = useState(false);

  const [banner, setBanner] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(15);

  // ⚡ PRELOAD all audio safely
  const sndCorrect = useRef(new Audio("/sounds/correct.mp3"));
  const sndWrong = useRef(new Audio("/sounds/wrong.mp3"));
  const sndNext = useRef(new Audio("/sounds/click.wav"));
  const sndClick = useRef(new Audio("/sounds/click.wav"));
  const sndLeaderboard = useRef(new Audio("/sounds/leaderboard.wav"));

  // 🔊 Play 2 SEC sound (ALWAYS 2 sec)
  const play2Sec = (ref, skip = 0) => {
    const audio = ref.current;
    audio.pause();
    audio.currentTime = skip; // skip beginning if needed (next sound)
    audio.play().catch(() => {});

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2000); // always play for exactly 2 sec
  };

  // 🔊 Click sound for every button
  const playClick = () => play2Sec(sndClick);

  useEffect(() => {
    if (!socket) return;

    if (!isHost) {
      socket.emit("join_room", { code, playerName });
    }

    socket.on("room_update", ({ players }) => setPlayers(players));

    socket.on("quiz_started", ({ total }) => {
      setTotal(total);
      play2Sec(sndNext, 1); // skip first 1 second
    });

    socket.on("timer", ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    socket.on("question", ({ index, total, timePerQuestion, q }) => {
      play2Sec(sndNext, 1); // skip first sec ONLY for next sound

      setIndex(index);
      setTotal(total);
      setQuestion(q);

      setTimePerQuestion(Number(timePerQuestion));

      setSelected(null);
      setCorrectAnswer(null);
      setLocked(false);
      setBanner(null);
    });

    socket.on("answer_result", ({ firstResponder, chosen, correctAnswer, isCorrect }) => {
      setLocked(true);
      setSelected(chosen);
      setCorrectAnswer(correctAnswer);

      setBanner(
        isCorrect
          ? `✔ ${firstResponder} answered correctly!`
          : `✖ ${firstResponder} answered wrong!`
      );

      if (isCorrect) play2Sec(sndCorrect);   // 2 sec applause FIXED
      else play2Sec(sndWrong);
    });

    socket.on("quiz_end", ({ leaderboard }) => {
      setLeaderboard(leaderboard);
      play2Sec(sndLeaderboard);
    });

    return () => {
      socket.off("room_update");
      socket.off("quiz_started");
      socket.off("timer");
      socket.off("question");
      socket.off("answer_result");
      socket.off("quiz_end");
    };
  }, [socket]);

  const submit = (opt) => {
    if (locked) return;
    playClick(); // button click sound

    setSelected(opt);
    setLocked(true);
    socket.emit("submit_answer", { code, answer: opt });
  };

  if (leaderboard) {
    return (
      <div className="solo-card results">
        <h2>🏆 Leaderboard</h2>
        {leaderboard.map((p, i) => (
          <div
            key={i}
            className="score-item"
            style={{
              backgroundColor:
                i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "#cd7f32" : ""
            }}
            onClick={playClick}
          >
            {i + 1}. {p.name} <b>{p.score}</b>
          </div>
        ))}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="lobby-code-card">
        <h2>Lobby Code: {code}</h2>
        <p>Waiting for quiz to start…</p>
      </div>
    );
  }

  const totalTime = total * timePerQuestion;
  const ringPct = totalTime > 0 ? Math.max(0, timeLeft / totalTime) : 0;
  const dash = `${ringPct * 100}, 100`;

  return (
    <div className="solo-ai-root">
      <div className="solo-card quiz">

        <div className="quiz-header">
          <div className="progress-pill">{index + 1}/{total}</div>

          <div className="timer-wrap">
            <div className="timer">
              <svg viewBox="0 0 36 36">
                <path
                  className="timer-bg"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="timer-fg"
                  strokeDasharray={dash}
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="time-text">{timeLeft}s</div>
            </div>
          </div>
        </div>

        <div className="question-area">
          {banner && <div className="result-banner">{banner}</div>}

          <h2 className="q-text">{question.q}</h2>

          <div className="options">
            {question.options.map((opt, i) => (
              <button
                key={i}
                className={`option 
                  ${selected === opt ? "selected" : ""}
                  ${locked && opt === correctAnswer ? "correct" : ""}
                  ${locked && selected === opt && opt !== correctAnswer ? "wrong" : ""}
                `}
                onClick={() => submit(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
