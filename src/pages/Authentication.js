// Authentication.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import Quiz from './Quiz';
import Information from "./Information";
import Leaderboard from './Leaderboard';

import { auth } from "../Assets/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./App.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
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
  
          <button onClick={handleSignOut}>Sign Out</button>

        </div>
      </Router>
      ) : (
        
        <div className="FormHolder">
          <div className='H1'>
            <h1>Solar Eclipse</h1>
          </div>
          <input className="AuthenticationForm"
            type="email"
            placeholder="Email..."
            onChange={(event) => setEmail(event.target.value)}
          />
          <input className="AuthenticationForm"
            type="password"
            placeholder="Password..."
            onChange={(event) => setPassword(event.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}

export default Auth;
