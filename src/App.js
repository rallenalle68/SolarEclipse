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
Next Question and user feedback after each question ❌
Sun animation ❌
Rounds for questions ❌
Clean up database and set it ready for users ❌
Winner anouncment ❌
Forgotten password ❌

credits
Image by <a href="https://www.freepik.com/free-vector/background-pixel-rain-abstract_6072178.htm#query=pixel%20space&position=14&from_view=keyword&track=ais&uuid=352fae14-941a-4068-80b6-2a1acc65273c">Freepik</a>


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
