// Authentication.js
import React, { useState, useEffect } from "react";
import './App.css';
// Pages
import { doc, setDoc } from "firebase/firestore";
// Auth Functionality
import { auth, db } from "../Assets/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import HomePage from "./HomePage";
import { collection, query, getDocs, where } from 'firebase/firestore';
import sunImg from '../Assets/Sun.png';
import moonImg from '../Assets/Moon.png'
// import { render } from '@react-email/render';
// import nodemailer from 'nodemailer';
// import { SignUpEmail } from "../Email";


function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("initial"); // Added state for mode
  const [user, setUser] = useState(null);
  const [errorMessage, seterrorMessage] = useState("")
  
  const checkUsernameAvailability = async (username) => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(query(usersRef, where("username", "==", username)));
  
    return querySnapshot.empty; // Returns true if the username is available, false otherwise
  };

  /*==================== Set up for sending email ======================*/
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.forwardemail.net',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'solareclipse@gannon.edu',
  //     pass: '',
  //   },
  // });
  
  // const emailHtml = render(<SignUpEmail />);

  // const options = {
  //   from: 'solareclipse@gannon.edu',
  //   to: 'ly001@gannon.edu',
  //   subject: 'Sign Up testing email',
  //   html: emailHtml,
  // };
  
  const handleSignUp = async () => {
    try {
      if (!email.includes("@gannon.edu")) {
        seterrorMessage("Invalid email. Must be a Gannon email!");
        console.log("Invalid Email!");
      } else {
        
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
        await setDoc(doc(db, "users", userId), {
          username: username,
          score: 0
        });
  
        console.log("Document written with ID: ", userId);

        /*==================Sending email ====================*/
        // await transporter.sendMail(options);
      }
    } catch (error) {
      if(error.message.includes("weak")){
        seterrorMessage("Weak password, must be at least 6 characters");
      }
      else if(error.message.includes("taken")){
        seterrorMessage("Username already taken");
      }
      console.error(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      seterrorMessage("")
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      if(error.message.includes("invalid-credential")){
        seterrorMessage("Invalid email or password")
      } else{
        seterrorMessage(error.message)
      }
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
    <div style={{display: 'relative'}}>
      <div class="sun"><img src={sunImg} alt="" /></div>
      <div class="moon"><img src={moonImg} alt="" /></div>
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
              
                <button onClick={() => {setMode("initial"); seterrorMessage("")}}>Back</button>
              

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
    </div>
  );
}

export default Authentication;
