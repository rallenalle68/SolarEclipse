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
  
  //Production Mode
  return (
    <div className='App'>
       <Authentication /> 
    </div>
  );
}

export default App;
