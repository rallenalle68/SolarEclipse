
/* 
TODO LIST:
Set up Navigation to information page and leaderboard ✅
Set up UI ✅
Score needs to update accordingly ✅
Track which question each player is on ✅
Send scores to database and realtime database ✅
Leaderboard ui ✅
Leaderboard sorting ✅
Username validation ✅
Credits ✅
Error handling in all places ✅
Next Question and user feedback after each question ✅
Rounds for questions ✅
Clean up database and set it ready for users ✅
Count down for the rounds ✅
Forgotten password ✅

Bullet points in information ✅

Schedule rounds ✅
color of podium ✅
color of phases ✅
phases box ✅
authentication page pluss sign bug ✅
information boxes formatting ✅

Welcome to quiz design box ✅
Each round and total leaderboard ✅
Leaderboard round buttons design ✅
Rounds scoring ✅
Safety information on homepage ✅
Error message more clear ✅
leaderboard podium with prizez (potentially) ❌
Enable enter on authentication ❌ 
More information about the places in map ❌



Cloud messaging ❌

*/
// App.js

// Baileys effect
// Diamond ring effect
// Animals
// temperatures
// Distances
// Angles
// Moon Size to sun

import React, { useState, useEffect } from "react";
import './pages/App.css';
import { auth } from "./Assets/firebase-config";
import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false); // Set loading to false once authentication state is resolved
    });
    document.title = "Eclipse Quiz";
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {loading ? (
        // Show loading indicator or splash screen while app is loading
        <LoadingScreen/>
      ) : (
        // Conditional rendering based on authentication state
        user ? <HomePage user={user} /> : <Authentication />
      )}
    </div>
  );
}

export default App;

