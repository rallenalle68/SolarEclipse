// TODO LIST:
// Store questions in a llist, external?
// Set up Navigation to information page and leaderboard
// Set up UI
// Connect to firebase and store data
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import questions from './question';

function Leaderboard() {
  return <p>Leaderboard</p>;
}

function Quiz({score, setScore}) {
  // Your quiz component logic here
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
  return (<p>information about the solar eclipse</p>);
}

function App() {
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
