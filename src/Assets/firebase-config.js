
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this line
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC40PEKjnmIqAkRTSvNVVj5iL1y55Uk7Ps",
  authDomain: "gannonsolareclipse.firebaseapp.com",
  databaseURL: "https://gannonsolareclipse-default-rtdb.firebaseio.com",
  projectId: "gannonsolareclipse",
  storageBucket: "gannonsolareclipse.appspot.com",
  messagingSenderId: "1065976711375",
  appId: "1:1065976711375:web:04a9253f66f690a46e8fba",
  measurementId: "G-4HS9MLWVSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };