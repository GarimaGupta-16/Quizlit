import "./Game.css";

export default function Game() {
  return (
    <div className="how-container">

      {/* MAIN TITLE */}
      <h1 className="how-title">How to Play Quiz</h1>
      <p className="how-subtitle">
        Learn how QuizLit works and get ready to challenge your knowledge!
      </p>

      {/* SECTION: ABOUT */}
      <div className="info-card">
        <span className="material-symbols-rounded info-icon">quiz</span>
        <h2>What is QuizLit?</h2>
        <p>
          QuizLit is an interactive quiz platform where you can create, join, and
          play quizzes on different topics. It’s simple, fun, and perfect for
          learning or testing your skills.
        </p>
      </div>

      {/* SECTION: HOW TO PLAY STEPS */}
      <h2 className="section-title">How to Play</h2>

      <div className="steps-grid">

        <div className="step-card">
          <span className="material-symbols-rounded step-icon">add_circle</span>
          <h3>Create a Quiz</h3>
          <p>Make your own quiz by adding questions and answers.</p>
        </div>

        <div className="step-card">
          <span className="material-symbols-rounded step-icon">group</span>
          <h3>Join Quiz</h3>
          <p>Enter a quiz code shared by your friend or teacher.</p>
        </div>

        <div className="step-card">
          <span className="material-symbols-rounded step-icon">play_circle</span>
          <h3>Start Playing</h3>
          <p>Answer questions within time and compete for the highest score.</p>
        </div>

        <div className="step-card">
          <span className="material-symbols-rounded step-icon">emoji_events</span>
          <h3>See Results</h3>
          <p>Check your score, accuracy, and performance instantly.</p>
        </div>
      </div>

      {/* SECTION: RULES */}
      <h2 className="section-title">Rules & Guidelines</h2>

      <div className="rules-card">
        <ul>
          <li>No cheating — stay honest while answering!</li>
          <li>Each question may have only one correct answer.</li>
          <li>You must complete the quiz before the timer ends.</li>
          <li>Once submitted, answers cannot be changed.</li>
          <li>Some quizzes may have negative marking.</li>
        </ul>
      </div>

      {/* SECTION: TIPS */}
      <h2 className="section-title">Tips to Score Better</h2>

      <div className="tips-card">
        <ul>
          <li>Read each question carefully.</li>
          <li>Manage your time wisely.</li>
          <li>Skip hard questions and return later.</li>
          <li>Practice regularly in Random Quiz mode.</li>
          <li>Challenge yourself with AI-generated quizzes.</li>
        </ul>
      </div>

    </div>
  );
}
