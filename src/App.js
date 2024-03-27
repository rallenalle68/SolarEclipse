import React, { useEffect } from "react";
import './pages/App.css';
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

Phases design ❌
Welcome box ❌
Bullet points in information ❌
leaderboard podium with prizez (potentially) ❌

Cloud messaging ❌
Each round and total leaderboard ❌
Schedule rounds (node cron) ❌
Seperate the frontend and backend

Winner anouncment ❌

*/
// App.js

// Baileys effect
// Diamond ring effect
// Animals
// temperatures
// Distances
// Angles
// Moon Size to sun

import Authentication from './pages/Authentication';

function App() {

  useEffect(() => {
    document.title = 'Eclipse';
    // Optionally, reset the title when the component unmounts
    return () => {
      document.title = 'Eclipse';
    };
  }, []);
  
  //Production Mode
  return (
    <div className='App'>
       <Authentication /> 
    </div>
  );
}

export default App;
