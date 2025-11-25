import React from 'react';
import './Navbar.css';
import logoImg from '../assets/logo.png';
import { Link } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">

    
      <div className="navbar-left">
        <Link to="/" className="logo" aria-label="Home">
          <img src={logoImg} alt="QuizLit logo" className="logo-image" />
          <span className="logo-text">QuizLit</span>
        </Link>
      </div>

     
      <div className="navbar-right">

        <Link to="/" className="nav-icon" title="Home">
          <span className="material-symbols-rounded">home</span>
        </Link>

        <Link to="/history" className="nav-icon" title="History">
          <span className="material-symbols-rounded">history</span>
        </Link>

        <Link to="/profile" className="nav-icon" title="Profile">
          <span className="material-symbols-rounded">person</span>
        </Link>

        <Link to="/game" className="nav-icon" title="How to Play">
          <span className="material-symbols-rounded">sports_esports</span>
        </Link>

       
        <button
          className="nav-icon"
          title="Toggle Theme"
          aria-label="Toggle Theme"
          onClick={toggleDarkMode}
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
