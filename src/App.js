import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './pages/App.css';
// Pages
import Quiz from './pages/Quiz';
import Information from "./pages/Information";
import Leaderboard from './pages/Leaderboard';
import mySVG from './Assets/wave.svg';

/* 
TODO LIST:                                                                 Status
------------------------------------------------------------------------------------------
Store questions in a list                                                  Done
Set up Navigation to information page and leaderboard                      Done
Firebase authentication                                                    In progress
Set up UI                                                                  In progress
Connect to firebase and store data                                         In progress 
*/
// App.js
import React, { useState } from "react";
import './pages/App.css';
// import Authentication from './pages/Authentication';

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
    
            
            <button className='SignOutButton'> Sign Out</button>
          </div>
        </Router>
  );
}

function App() {
  
  //Production Mode
  return (
    <div className='App'>
      <HomePage />;
    </div>
  );
  // Test Mode: Uncomment
  // return <Authentication />;
}

export default App;
