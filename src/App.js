/* TODO LIST:                                                              Status
------------------------------------------------------------------------------------------
Store questions in a list                                                  Done
Set up Navigation to information page and leaderboard                      Done
Set up UI                                                                  In progress
Connect to firebase and store data                                         Not started */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import questions from './question';

function Leaderboard() {
  // Leaderboad Component
  return <p>Leaderboard</p>;
}

function Quiz({score, setScore}) {
  // Quiz Component
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  function scoreUpdate(selectedOption){
    if(selectedOption === currentQuestion.correctOption){
      setScore(prevScore => prevScore +1);

    }
    nextQuestion();
  }
  function nextQuestion(){
    setCurrentQuestionIndex(prevIndex =>{
      if(prevIndex >= questions.length -1)return 0;
      return prevIndex +1;
    })
  }
  return (
    <div>
      <h2>Question {currentQuestion.id}</h2>
      <p>{currentQuestion.text}</p>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => scoreUpdate(option)}>{option}</button>
          </li>
        ))}
      </ul>
      <p>Score: {score}</p>
    </div>
  );
}

function Information() {
  // Information Component
  return (<p>information about the solar eclipse</p>);
}

function App() {
  // Main App component
  const [score, setScore] = useState(0);

  return (
    <Router>
      <div className="App">
        <div className='H1'>
          <h1>Gannons Eclipse Knowledge</h1>
        </div>

        {/* Navigation Links */}
        <nav>
          <Link to="/quiz">Quiz</Link>
          <Link to="/Leaderboard">Leaderboard</Link>
          <Link to="/Information">Information</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/quiz" element={<Quiz score={score} setScore={setScore} />} />
          <Route path="/Information" element={<Information />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
