// Authentication.js
import React, { useState, useEffect } from "react";
import './App.css';
// Pages
import { addDoc, collection } from "firebase/firestore";
import FirstPage from "./FirstPage"

// Auth Functionality
import { auth, db } from "../Assets/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, username, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error.message);
    }
    try {
      const docRef = await addDoc(collection(db, "users"), {
        username: username,
        score: 0
      });
      console.log("Document written with ID: ", docRef.id);
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
      {user ? (
        <FirstPage />
      ) : (
        <div className="FormHolder">
          <div className='H1'>
            <h1>Solar Eclipse</h1>
          </div>
          <input
            className="AuthenticationForm"
            type="email"
            placeholder="Email..."
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="AuthenticationForm"
            type="username"
            placeholder="Username..."
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            className="AuthenticationForm"
            type="password"
            placeholder="Password..."
            onChange={(event) => setPassword(event.target.value)}
          />
          <button onClick={handleSignUp}>Create Account</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}

export default Authentication;
