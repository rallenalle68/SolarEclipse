import React, { useState, useEffect } from "react";
import './App.css';
// Auth Functionality
import { auth, realtimeDb, db } from "../Assets/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import HomePage from "./HomePage";
import { collection, query, getDocs, where } from 'firebase/firestore';
import { ref, set } from 'firebase/database';

function Authentication() {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("initial"); // State to manage different modes
  const [user, setUser] = useState(null); // State to manage user authentication status
  const [errorMessage, seterrorMessage] = useState(""); // State to handle error messages

  // Function to check if a username is available
  const checkUsernameAvailability = async (username) => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(query(usersRef, where("username", "==", username)));
    return querySnapshot.empty; // Returns true if the username is available, false otherwise
  };
  
  // Function to handle user sign up
  const handleSignUp = async () => {
    try {
      // Check if the email is a Gannon email
      if (!email.includes("@gannon.edu")) {
        seterrorMessage("Invalid email. Must be a Gannon email!");
        console.log("Invalid Email!");
      } else if(username === ""){
        seterrorMessage("No username given!");
      }
      else {
        // Check if the username is available
        const isUsernameAvailable = await checkUsernameAvailability(username);
        if (!isUsernameAvailable) {
          seterrorMessage("Username is already taken. Please choose a different one.");
          return; // Exit function if the username is not available
        }

        // Continue with user registration since the username is available
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        const userId = userCredential.user.uid;
        seterrorMessage("");

        // Save user data to Firestore
        const userRef = ref(realtimeDb, `users/${userId}`);
          set(userRef, {
            allQuestionsAnswered: false,
            correctAnswers: 0, // Correct typo here
            quizStarted: false,
            currentRound:0,
            username: username,
            score: 0,
          }).then(() => {
            console.log("User data successfully written to the Realtime Database.");
          }).catch((error) => {
            console.error("Error writing user data to the Realtime Database:", error);
            seterrorMessage("Error occurred while saving user data.");
          });

      }
    } catch (error) {
      // Handle different types of errors
      if(error.message.includes("weak")){
        seterrorMessage("Weak password, must be at least 6 characters");
      }
      else if(error.message.includes("taken")){
        seterrorMessage("Username already taken!");
      }
       else if(error.message.includes("in-use")){
        seterrorMessage("Email already in use!")
      } else if(error.message.includes("missing-password")){
        seterrorMessage("Missing password!")
      }
      
    }
  };

  // Function to handle user sign in
  const handleSignIn = async () => {
    try {
      seterrorMessage(""); // Clear any previous error message
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      // Handle different types of errors
      if(error.message.includes("invalid")){
        seterrorMessage("Invalid email or password")
      } else{
        seterrorMessage(error.message)
      }
    }
  };

  // Effect hook to listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {!user && mode === "initial" && (
        <div className="ParentFormHolder">
          <div className='Header'>
            <h1>Gannon's Eclipse</h1>
          </div>

          <div className="FormsContainer">
            <div style={{marginTop:14, marginBottom:14, fontSize:20}}>
              <p>Welcome to the Gannon Solar eclipse Quiz!</p>
              <p>We hope you have been refining your astrophysics skills. </p>
              <p>Because if you have... You can compete against the brightest minds in Gannon!</p>
              <p>Create an account, and have the chance to win some exciting prices.</p>
            </div>
            <div>
              <button onClick={()=>setMode("createAccount")}>Create Account</button>
              <button onClick={()=>setMode("signIn")}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {!user && (mode === "createAccount" || mode === "signIn") && (
        <div className="ParentFormHolder">
          <div className='Header'>
            <h1>Gannon's Eclipse</h1>
          </div>

          <div className="FormsContainer">
            
              <button onClick={() => {setMode("initial"); seterrorMessage("")}}>Back</button>
            

            {mode === "createAccount" && (
              
              // ADD username usage info
              <>
                
                <span style={{marginTop:4}}>Username will be displayed in the leaderboard</span>
                <input
                  className="inputForm"
                  type="username"
                  placeholder="Username..."
                  onChange={(event) => setUsername(event.target.value)} /></>
            )}

            <input
              className="inputForm"
              type="email"
              placeholder="Email..."
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              className="inputForm"
              type="password"
              placeholder="Password..."
              onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={mode === "createAccount" ? handleSignUp : handleSignIn}>
              {mode === "createAccount" ? "Create Account" : "Sign In"}
            </button>
              {errorMessage && (
                <div className="error-message">
                  <span>{errorMessage}</span>
                </div>
              )}
          </div>
          
        </div>
      )}

      

      {user && (
        <HomePage auth={auth} user={user} username={username} />
      )}

    </div>
  );
}

export default Authentication;
