import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
// Pages
import Quiz from './Quiz';
import Information from "./Information";
import Leaderboard from './Leaderboard';
import SolarEclipse from './SolarEclipse';

function HomePage({ handleSignOut, user }){
    const [score, setScore] = useState(0);  

    return(
      <Router>
            <div className="App">
  
              <div className='Header'>
                  <h1>Gannon's Eclipse</h1>
              </div>

              <div className="NavigationContainer">
                <nav className="NavigationLinks">
                  <Link to="/Leaderboard">Leaderboard</Link>
                  <Link to="/Quiz">Quiz</Link>
                  <Link to="/SolarEclipse">Solar Eclipse</Link>
                  <Link to="/Information">Information</Link>
                </nav>
              </div>

              <Routes>
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/Quiz" element={<Quiz user={user} score={score} setScore={setScore} />} />
                <Route path="/Information" element={<Information />} />
                <Route path="/SolarEclipse" element={<SolarEclipse />} />
              </Routes>
      
              
              <button className='SignOutButton' onClick={handleSignOut}> Sign Out</button>
            </div>
          </Router>
    );
  }

  export default HomePage;