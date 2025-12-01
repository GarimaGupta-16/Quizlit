// src/components/JoinQuiz.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import "./JoinQuiz.css";

// --- Universal sound function (always 2 sec) ---
function playSound(ref) {
  if (!ref.current) return;
  try {
    ref.current.currentTime = 0;
  } catch {}
  ref.current.play().catch(() => {});

  // Force stop after 2 sec
  setTimeout(() => {
    try {
      if (ref.current) ref.current.pause();
    } catch {}
  }, 2000);
}

export default function JoinQuiz() {
  const navigate = useNavigate();
  const socket = useSocket();

  // ------------ SOUND REFS ------------
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const nextSound = useRef(new Audio("/sounds/click.wav"));
  const wrongSound = useRef(new Audio("/sounds/wrong.mp3"));

  // ------------ STATE ------------
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  // Manual validation helper
  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      playSound(wrongSound);
      return false;
    }
    if (!code.trim()) {
      setError("Please enter a lobby code.");
      playSound(wrongSound);
      return false;
    }
    setError(null);
    return true;
  };

  const handleJoin = (e) => {
    // Prevent default always — we are handling validation manually
    if (e && e.preventDefault) e.preventDefault();

    // Play click sound for the button press
    playSound(clickSound);

    if (!socket) {
      setError("Socket not ready");
      playSound(wrongSound);
      return;
    }

    // Run manual validation (native browser validation disabled)
    if (!validate()) return;

    // Send join request
    socket.emit(
      "join_room",
      { code: code.toUpperCase(), playerName: name.trim() },
      (res) => {
        if (res && res.ok) {
          playSound(nextSound); // entering room → next sound
          navigate(`/quizroom/${code.toUpperCase()}`, {
            state: { playerName: name.trim(), isHost: false },
          });
        } else {
          // server error (room not found / full)
          setError(res?.error || "Room not found or is full.");
          playSound(wrongSound);
        }
      }
    );
  };

  const shakeClass = error ? " shake-error" : "";

  return (
    <div className="join-quiz-container">
      <div className={`join-card${shakeClass}`}>
        <div className="header-icon floating-icon">🧠</div>
        <h1 className="join-title">Join a Quiz</h1>
        <p className="join-subtitle">Enter the lobby code and your nickname to play.</p>

        {/* IMPORTANT: noValidate prevents browser blocking so we can run our own checks */}
        <form onSubmit={handleJoin} className="join-form" noValidate>
          {/* Player Name */}
          <input
            className="code-input"
            placeholder="Enter your name "
            value={name}
            onChange={(e) => {
              playSound(clickSound); // typing/click sound
              setName(e.target.value);
              if (error) setError(null);
            }}
            aria-label="Player name"
            style={{ fontSize: "1.4rem", letterSpacing: "2px", padding: "15px" }}
          />

          {/* Lobby Code */}
          <div className="code-input-wrapper">
            <input
              className="code-input"
              placeholder="000000"
              value={code}
              onChange={(e) => {
                playSound(clickSound); // typing/click sound
                // keep uppercase and limit to 6 chars
                setCode(e.target.value.toUpperCase().slice(0, 6));
                if (error) setError(null);
              }}
              aria-label="Lobby code"
              maxLength={6}
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-msg" role="alert">{error}</p>}

          {/* Join Button */}
          <button
            type="submit"
            className="join-btn"
            onClick={(ev) => {
              /* keep click sound as a responsive immediate feedback (handleJoin also plays) */
              playSound(clickSound);
            }}
          >
            Join Game <span className="btn-icon">🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
