import React from "react";
import './pages/App.css';
import HomePage from './pages/FirstPage';
import './pages/App.css';
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
import Authentication from './pages/Authentication';

function App() {
  
  //Production Mode
  return (
    <div className='App'>
       <Authentication /> 
    </div>
  // Test Mode: Uncomment
  // <HomePage />
  );
}

export default App;
