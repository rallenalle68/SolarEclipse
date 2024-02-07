import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
// Pages
import Quiz from './Quiz';
import Information from "./Information";
import Leaderboard from './Leaderboard';


function HomePage(){

    const [score, setScore] = useState(0);
    return(
      <Router>
            <div className="App">
  
              <div className='Header'>
              <div className='H1'>
                  <h1>Gannons Eclipse Knowledge</h1>
                </div>
        
                {/* Navigation Links */}
                <nav>
                  <Link to="/Leaderboard">Leaderboard</Link>
                  <Link to="/quiz">Quiz</Link>
                  <Link to="/Information">Information</Link>
                </nav>
              {/* Routes */}
              <Routes>
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/quiz" element={<Quiz score={score} setScore={setScore} />} />
                <Route path="/Information" element={<Information />} />
              </Routes>
                </div>
      
              
              <button className='SignOutButton'> Sign Out</button>
            </div>
          </Router>
    );
  }

  export default HomePage;