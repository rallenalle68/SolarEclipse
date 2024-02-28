import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/question';
import { db } from '../Assets/firebase-config';
import { collection, doc,getDocs, getDoc, updateDoc, addDoc, orderBy, query, limit } from 'firebase/firestore';

function Quiz({ score, setScore, user }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const currentQuestion = questions[currentQuestionIndex];
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [userName, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userId = user.uid;
        const userDocRef = doc(usersCollection, userId);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData) {
            setAllQuestionsAnswered(userData.allQuestionsAnswered);
            setScore(userData.score || 0);
            setCorrectAnswers(userData.totalCorrect || 0);
            setUsername(userData.username || "");

          }
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
      }
    };
  
    fetchUserData();
  }, [user]);

  useEffect(() => {
    let interval;
  
    if (!allQuestionsAnswered) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            nextQuestion();
            return 10;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(interval); // Pass the interval ID to clearInterval
  }, [currentQuestionIndex, allQuestionsAnswered]);

  async function updateFirestore(score, correctAnswers) {
    const usersCollection = collection(db, 'users');
    const userId = user.uid;
    const userDocRef = doc(usersCollection, userId);
  
    try {
      if ((await getDoc(userDocRef)).exists()) {
        await updateDoc(userDocRef, { score: score, allQuestionsAnswered: true, totalCorrect: correctAnswers });
        console.log('Score successfully updated in Firestore');
      } else {
        console.error('Document does not exist. Cannot update score in Firestore.');
      }
    } catch (error) {
      console.error('Error updating score in Firestore:', error);
    }
  
    // Update leaderboard collection
    const leaderboardCollection = collection(db, 'leaderboard');
    const newLeaderboardEntry = { username: userName, score: score };
  
    try {
      // Fetch the current leaderboard data
      const leaderboardQuery = query(leaderboardCollection, orderBy('score', 'desc'), limit(10));
      const leaderboardSnapshot = await getDocs(leaderboardQuery);
  
      // Convert the query snapshot into an array of documents
      const leaderboardData = leaderboardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Check if the user already has an entry in the leaderboard
      const userEntryIndex = leaderboardData.findIndex(entry => entry.username === userName);
  
      if (userEntryIndex !== -1) {
        // Update existing entry in the leaderboard
        const userLeaderboardDocRef = doc(leaderboardCollection, leaderboardData[userEntryIndex].id);
        await updateDoc(userLeaderboardDocRef, { score: score });
      } else {
        // Add a new entry to the leaderboard
        await addDoc(leaderboardCollection, newLeaderboardEntry);
      }
  
      console.log('Leaderboard successfully updated in Firestore');
    } catch (error) {
      console.error('Error updating leaderboard in Firestore:', error);
    }
  }
  

  function scoreUpdate(selectedOption) {
    const isCorrect = selectedOption === currentQuestion.correctOption;
    const calculatedScore = isCorrect ? timer : 0;
  
    setScore((prevScore) => prevScore + calculatedScore);
    const updatedCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    setCorrectAnswers(updatedCorrectAnswers);
  
    if (currentQuestionIndex === questions.length - 1) {
      setAllQuestionsAnswered(true);
      updateFirestore(score + calculatedScore, updatedCorrectAnswers);
      clearInterval(); // Stop the timer when all questions are answered
    } else {
      nextQuestion();
    }
  }

  function nextQuestion() {
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex >= questions.length - 1) {
        setAllQuestionsAnswered(true);
        return 0;
      }
      return prevIndex + 1;
    });
    setTimer(10);
  }

  return (
    <div className='Quiz'>
      <div>
        {allQuestionsAnswered ? (
          <div className='CompletedRound'>
            <p className='p1'>Round 1 Completed</p>
            <p className='p2'>Total correct answers: {correctAnswers}</p>
            <p className='p3'>Your score: {score}</p>
            <p className='p4'>Next round will start at 12 pm!</p>
          </div>
        ) : (
          <div className='Quiz-main'>
            <p>{currentQuestion.text}</p>
            <p className='Timer'>{timer}</p>
            <div className='quiz-container'>
              <ul>
                {currentQuestion.options.map((option, index) => (
                  <li key={index} className='question-box'>
                    <button onClick={() => scoreUpdate(option)}>{option}</button>
                  </li>
                ))}
              </ul>
            </div>
            <p className='score'>Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
