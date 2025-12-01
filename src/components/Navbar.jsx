import React, { useRef } from 'react';
import './Navbar.css';
import logoImg from '../assets/logo.png';
import { Link } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {

  // 🔊 CLICK SOUND (2 sec)
  const clickSound = useRef(new Audio("/sounds/click.wav"));

  const playClick = () => {
    clickSound.current.currentTime = 0;   // restart
    clickSound.current.play();
    setTimeout(() => {
      clickSound.current.pause();
    }, 2000);                              // force stop at 2s
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">

      <div className="navbar-left">
        <Link to="/" className="logo" aria-label="Home" onClick={playClick}>
          <img src={logoImg} alt="QuizLit logo" className="logo-image" />
          <span className="logo-text">QuizLit</span>
        </Link>
      </div>

      <div className="navbar-right">

        <Link to="/" className="nav-icon" title="Home" onClick={playClick}>
          <span className="material-symbols-rounded">home</span>
        </Link>

        <Link to="/history" className="nav-icon" title="History" onClick={playClick}>
          <span className="material-symbols-rounded">history</span>
        </Link>

        <Link to="/profile" className="nav-icon" title="Profile" onClick={playClick}>
          <span className="material-symbols-rounded">person</span>
        </Link>

        <Link to="/game" className="nav-icon" title="How to Play" onClick={playClick}>
          <span className="material-symbols-rounded">sports_esports</span>
        </Link>

        <button
          className="nav-icon"
          title="Toggle Theme"
          aria-label="Toggle Theme"
          onClick={() => { playClick(); toggleDarkMode(); }}
        >
          <span className="material-symbols-rounded">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
