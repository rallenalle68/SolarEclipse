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
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { ref, set, get } from 'firebase/database';
import { sendPasswordResetEmail } from "firebase/auth";
import { TypeAnimation } from 'react-type-animation';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';

function Authentication() {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("initial"); // State to manage different modes
  const [user, setUser] = useState(null); // State to manage user authentication status
  const [errorMessage, seterrorMessage] = useState(""); // State to handle error messages
  const [resetPassword, setResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Function to check if a username is available
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

          setEmail("");
          setPassword("");
          setUsername("");
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
        const userId = userCredential.user.uid;
        setEmail("");
        setPassword("");
        // Check if the user exists in the leaderboard collection in Firestore
        const userDocumentRef = doc(db, 'leaderboard', userId);
        const userDocumentSnapshot = await getDoc(userDocumentRef);

        if (!userDocumentSnapshot.exists()) {
            // If the user doesn't exist in the leaderboard collection, fetch the username from the Realtime Database
            const userRef = ref(realtimeDb, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            if (userData) {
                const { username } = userData;
                // Reset the Realtime Database with initial values for the user
                await set(userRef, {
                    allQuestionsAnswered: false,
                    correctAnswers: 0,
                    quizStarted: false,
                    currentRound: 0,
                    username: username || "", // Use username from the Realtime Database
                    score: 0,
                });
            } else {
                console.error("User data not found in the Realtime Database.");
            }
        }
    } catch (error) {
        // Handle errors
        console.error("Error signing in:", error);
        if (error.message.includes("invalid")) {
            seterrorMessage("Invalid email or password");
        } else {
            seterrorMessage("An error occurred while signing in. Please try again later.");
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


  const handlePasswordReset = async () => {
    try {
      // Validate email format (checking if it includes "@gannon.edu")
      if (!resetEmail.includes("@gannon.edu")) {
        throw new Error("Invalid email format. Must be a Gannon email (e.g., example@gannon.edu).");
      }
  
      // Validate email existence (checking if it's not empty)
      if (!resetEmail) {
        throw new Error("Please enter your email address.");
      }
  
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);
      
      // Set success message and reset form fields
      seterrorMessage("You will receive an email shortly, could take up to 2 min.");
      setMode("initial");
      setEmail("");
      setPassword("");
      setUsername("");
      setResetEmail("");
      setResetPassword(false);
  
      console.log("Password reset email sent successfully!");
      
      // Optionally, provide feedback to the user that the email has been sent
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      // Handle the error, for example, display an error message to the user
      seterrorMessage(error.message);
    }
  };

  const [isOpenSafetyInfo, setIsOpenSafetyInfo] = useState(false);
  const toggleAcordionSafetyInfo = () => {
      setIsOpenSafetyInfo(!isOpenSafetyInfo);
  }

  return (
    <div className="App">
      {mode === "initial" && (
        <div className="ParentFormHolder">
          <div className='Header'>
            <h1>Gannon's Eclipse</h1>
          </div>
          

          <div className="FormsContainer">
            <div className="InfoParagraphs" style={{display:'inline-block'}}>
              <p className='p1' style={{backgroundColor: 'white', color: 'black', borderRadius:4}}>
                Welcome to the 
                <TypeAnimation
                  sequence={[
                    `Gannon Solar eclipse Quiz!`,
                    1000,
                    "",
                  ]}
                  speed={30}
                  style={{ whiteSpace: 'pre-line', fontSize: '2rem', paddingLeft: '1rem', backgroundColor:'orange', color:'whitesmoke', borderRadius:4, width:'fit-content' }}
                  repeat={Infinity}
                /> 
              </p>
              <p style={{fontSize:18}}>We hope you have been refining your astrophysics skills. </p>
              <p style={{fontSize:18}}>Because if you have... You can compete against the brightest minds in Gannon!</p>
              <p style={{fontSize:18}}>Create an account, and have the chance to win some exciting prizes.</p>
            </div>
            <div>
              <button onClick={()=>setMode("createAccount")}>Create Account</button>
              <button onClick={()=>setMode("signIn")}>Sign In</button>
            </div>
          </div>



          <div className="opening" onClick={toggleAcordionSafetyInfo} style={{position: 'relative'}}>
            <div style={
              {
              backgroundColor: isOpenSafetyInfo ? 'orange' : 'white',
              color: isOpenSafetyInfo ? 'white' : 'black',
              width: '2rem',
              height: '2rem',
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              right: 0,
              cursor: 'pointer',
            }}>
              {isOpenSafetyInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
            <h2>Safety Information</h2>
            {isOpenSafetyInfo && 
              <ul>
                <li style={{listStyleType: 'circle'}}>Add Safety Info 1</li>
                <li style={{listStyleType: 'circle'}}>Add Safety Info 2</li> 
                <li style={{listStyleType: 'circle'}}>Add Safety Info 3</li>
              </ul>}
          </div>
        </div>
      )}

    {!user && (mode === "createAccount" || mode === "signIn") && (
      <div className="ParentFormHolder">
        <div className='Header'>
          <h1>Gannon's Eclipse</h1>
        </div>

        <div className="FormsContainer">
          
          <button onClick={() => {
            setMode("initial");
            seterrorMessage("");
            setEmail("");
            setPassword("");
            setUsername("");
            setResetEmail("");
            setResetPassword(false);
          }}>Back</button>
          
          {/* Render regular sign-in fields if resetPassword is false */}
          {!resetPassword && (
            <>
              {mode === "createAccount" && (
                <>
                  <span style={{marginTop:4}}>Username will be displayed in the leaderboard</span>
                  <input
                    className="inputForm"
                    type="username"
                    placeholder="Username..."
                    onChange={(event) => setUsername(event.target.value)}
                    value={username}
                  />
                </>
              )}
              
              <input
                className="inputForm"
                type="email"
                placeholder="Email..."
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
              
              <input
                className="inputForm"
                type="password"
                placeholder="Password..."
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
              
              {/* Render reset password button */}
              {mode === "signIn" && (
                <button onClick={() => setResetPassword(true)} style={{background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', boxShadow: 'none', color:'red', fontSize:18}}>forgot password?</button>
              )}
            </>
          )}

          {/* Render additional input field and button for password reset if resetPassword is true */}
          {resetPassword && (
            <>
              <input
                className="inputForm"
                type="email"
                placeholder="Enter your email..."
                onChange={(event) => setResetEmail(event.target.value)}
                value={resetEmail}
              />
              
              {/* Render reset password button */}
              <button onClick={handlePasswordReset}>Reset Password</button>
            </>
          )}

          {/* Sign Up or Sign In Button */}
          {!resetPassword && (
            <button onClick={mode === "createAccount" ? handleSignUp : handleSignIn}>
              {mode === "createAccount" ? "Create Account" : "Sign In"}
            </button>
          )}

          {/* Error Message */}
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
