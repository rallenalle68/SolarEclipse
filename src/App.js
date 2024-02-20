import React from "react";
import './pages/App.css';
import './pages/App.css';
/* 
TODO LIST:                                                                 Status
------------------------------------------------------------------------------------------
Set up Navigation to information page and leaderboard                      Done
Set up UI
Score needs to update accordingly
track which question each player is on
send scores to database and realtime database
sun animation
leader board ui


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
  
  //Production Mode
  return (
    <div className='App'>
       <Authentication /> 
    </div>
  );
}

export default App;
