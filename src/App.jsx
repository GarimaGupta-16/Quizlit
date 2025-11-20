import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Game from "./pages/Game";
import CreateQuiz from "./pages/CreateQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import RandomQuiz from "./pages/RandomQuiz";
import Ai from "./pages/Ai";

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.body.classList.toggle("dark-mode");  // ⭐ GLOBAL FIX
  };

  return (
    <Router>
      <div>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Game />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path ="/join-quiz" element={<JoinQuiz />} />
          <Route path="/random-quiz" element={<RandomQuiz />} />
          <Route path="/ai-quiz" element={<Ai />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
