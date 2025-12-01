// src/components/CreateQuiz.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const socket = useSocket();
  const navigate = useNavigate();

  // ----------- SOUND REFS -----------
  const applause = useRef(new Audio("/sounds/correct.mp3"));
  const nextSound = useRef(new Audio("/sounds/click.wav"));
  const wrongSound = useRef(new Audio("/sounds/wrong.mp3"));
  const clickSound = useRef(new Audio("/sounds/click.wav"));

  // ---- Universal 2-sec sound player ----
  const play2Sec = (ref) => {
    const audio = ref.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2000);
  };

  // ---- state ----
  const [formData, setFormData] = useState({
    playerName: "Host",
    topic: "",
    timePerQuestion: "15",
    numQuestions: "5"
  });

  const topics = [
    "General Knowledge",
    "Science: Computers",
    "Science & Nature",
    "Sports",
    "History",
    "Geography",
    "Politics",
    "Art",
    "Animals",
    "Vehicles",
    "Maths"
  ];

  const [players, setPlayers] = useState([]);
  const [lobbyCode, setLobbyCode] = useState(null);
  const [waiting, setWaiting] = useState(false);

  // ----------- Player joined ---> applause 2 sec -----------
  useEffect(() => {
    if (!socket) return;

    socket.on("room_update", ({ players }) => {
      setPlayers(players);
      play2Sec(applause);
    });

    return () => socket.off("room_update");
  }, [socket]);

  // ----------- Form Submit -----------
  const handleSubmit = (e) => {
    e.preventDefault();

    // EMPTY VALIDATION
    if (!formData.playerName.trim()) {
      play2Sec(wrongSound);
      alert("Please enter your name.");
      return;
    }
    if (!formData.topic.trim()) {
      play2Sec(wrongSound);
      alert("Please select a topic.");
      return;
    }

    // Emit socket event
    socket.emit(
      "create_room",
      { settings: formData, playerName: formData.playerName },
      (res) => {
        if (!res.ok) {
          play2Sec(wrongSound);
          return alert(res.error);
        }

        setLobbyCode(res.code);
        setWaiting(true);
        play2Sec(nextSound);
      }
    );
  };

  // ----------- Start quiz on ANY key press -----------
  const startOnKey = useCallback(() => {
    if (!waiting || !lobbyCode) return;

    window.removeEventListener("keydown", startOnKey);
    play2Sec(nextSound);

    navigate(`/quizroom/${lobbyCode}`, {
      state: { playerName: formData.playerName, isHost: true }
    });

    socket.emit("start_quiz", { code: lobbyCode });
  }, [waiting, lobbyCode]);

  useEffect(() => {
    if (waiting) window.addEventListener("keydown", startOnKey);
    return () => window.removeEventListener("keydown", startOnKey);
  }, [waiting, startOnKey]);


  // ------------- HANDLE INPUT CHANGE WITH CLICK SOUND + TYPING SOUND -------------
  const handleInput = (key, value) => {
    play2Sec(clickSound);
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="create-quiz-container">
      {!lobbyCode ? (
        <form className="quiz-config-card quiz-form" onSubmit={handleSubmit}>
          <h1>Create Quiz Lobby</h1>

          <input
            value={formData.playerName}
            onChange={(e) => handleInput("playerName", e.target.value)}
            onClick={() => play2Sec(clickSound)}
            placeholder="Your Name"
            required
          />

          <label>Topic</label>
          <select
            value={formData.topic}
            onChange={(e) => handleInput("topic", e.target.value)}
            onClick={() => play2Sec(clickSound)}
            required
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <label>Time per Question</label>
          <select
            value={formData.timePerQuestion}
            onChange={(e) => handleInput("timePerQuestion", e.target.value)}
            onClick={() => play2Sec(clickSound)}
          >
            <option value="10">10s</option>
            <option value="15">15s</option>
            <option value="20">20s</option>
          </select>

          <label>No. of Questions</label>
          <select
            value={formData.numQuestions}
            onChange={(e) => handleInput("numQuestions", e.target.value)}
            onClick={() => play2Sec(clickSound)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>

          <button
            type="submit"
            onClick={() => play2Sec(clickSound)}
          >
            Create Lobby
          </button>
        </form>
      ) : (
        <div className="lobby-code-card">
          <h2>Your Lobby Code</h2>
          <h1 className="lobby-code-display">
            {lobbyCode.split("").map((digit, index) => (
              <span key={index} className="code-digit">{digit}</span>
            ))}
          </h1>
          <p>Press ANY key to START the quiz…</p>

          <h3>Players:</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
