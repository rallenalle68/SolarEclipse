// Authentication.js
import React, { useState, useEffect } from "react";
import './App.css';
// Pages
import { doc, collection, setDoc } from "firebase/firestore";
// Auth Functionality
import { auth, db } from "../Assets/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import HomePage from "./HomePage";

function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("initial"); // Added state for mode
  const [user, setUser] = useState(null);

  const handleSignUp = async () => {
    try {
      if(!email.includes("@gannon.edu")){
        console.log("Invalid Email!")
      }
      else{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        const userId = userCredential.user.uid; // Get the user ID

        await setDoc(doc(db, "users", userId), {
          username: username,
          score: 0
        });

        console.log("Document written with ID: ", userId);
      }
    } catch (error) {
      console.error(error.message);
    }

    // Writing to the database:
    try {
    } catch (e) {
      console.error("Error adding document: ", e);
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
      {!user && mode === "initial" && (
        <div className="ParentFormHolder">
          <div className='Header'>
            <h1>Gannon's Eclipse</h1>
          </div>

          <div className="FormsContainer">
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
            
              <button onClick={() => setMode("initial")}>Back</button>
            

            {mode === "createAccount" && (
              <input
                className="inputForm"
                type="username"
                placeholder="Username..."
                onChange={(event) => setUsername(event.target.value)}
              />
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
          </div>
        </div>
      )}

      {user && (
        <HomePage handleSignOut={handleSignOut} user={user} />
      )}
    </div>
  );
}

export default Authentication;
