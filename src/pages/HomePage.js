import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
// Pages
import Quiz from './Quiz';
import Information from "./Information";
import Leaderboard from './Leaderboard';
import SolarEclipse from './SolarEclipse';

import sunImg from '../Assets/Sun.png';
import moonImg from '../Assets/Moon.png'

function HomePage({ user, username }){

    return(
      <Router>
            <div className="App">
  
              <div className="top">
                <div className='Header'>
                    <h1>Gannon Solar Eclipse Quiz</h1>
                </div>

                <div className="sunMoonContainer">
                  <div className="sunMoon">
                    <img src={sunImg} alt="" className="sun" />
                    <img src={moonImg} alt="" className="moon" />
                  </div>
                </div>

                <div className="NavigationContainer">
                  <nav className="NavigationLinks">
                    <Link to="/Leaderboard">Leaderboard</Link>
                    <Link to="/Quiz">Quiz</Link>
                    <Link to="/SolarEclipse">Solar Eclipse</Link>
                    <Link to="/Information">Information</Link>
                  </nav>
                </div>
              </div>

              <Routes>
                <Route path="/Leaderboard" element={<Leaderboard user={user} username={username} />} />
                <Route path="/Quiz" element={<Quiz user={user}/>} />
                <Route path="/Information" element={<Information/>} />
                <Route path="/SolarEclipse" element={<SolarEclipse />} />
              </Routes>
      
              
            </div>
          </Router>
    );
}

export default HomePage;
