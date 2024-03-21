import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/questions.json'; // Import the JSON file
import { db } from '../Assets/firebase-config';
import { collection, doc,getDocs, getDoc, updateDoc, addDoc, orderBy, query, limit } from 'firebase/firestore';

function Quiz({ score, setScore, user }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [userName, setUsername] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0); // Set currentRoundIndex to 0 to access Round 1
  const currentQuestion = questions.rounds[currentRoundIndex].questions[currentQuestionIndex]; // Access Round 1 questions
  const [roundFinished, setRoundFinished] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown time in seconds

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
            setQuizStarted(userData.quizStarted || false);
            setCurrentQuestionIndex(userData.currentQuestionIndex || 0);
            setAllQuestionsAnswered(userData.allQuestionsAnswered);
            setScore(userData.score || 0);
            setCorrectAnswers(userData.totalCorrect || 0);
            setUsername(userData.username || "");
            setCurrentRoundIndex(userData.currentRound || 0);
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

    if (!allQuestionsAnswered && timerRunning) {
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
  }, [currentQuestionIndex, allQuestionsAnswered, timerRunning]);

  useEffect(() => {
    if (roundFinished) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [roundFinished]);

  async function updateFirestore(score, correctAnswers) {
    const usersCollection = collection(db, 'users');
    const userId = user.uid;
    const userDocRef = doc(usersCollection, userId);
  
    try {
      if ((await getDoc(userDocRef)).exists()) {
        await updateDoc(userDocRef, { score: score, allQuestionsAnswered: true, totalCorrect: correctAnswers, currentRound: currentRoundIndex});
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

  function scoreUpdate(option) {
    const currentQuestion = questions.rounds[currentRoundIndex].questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctOption;
    const calculatedScore = isCorrect ? timer : 0;
  
    setScore(prevScore => prevScore + calculatedScore);
    const updatedCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    setCorrectAnswers(updatedCorrectAnswers);
  
    setSelectedOption(option);
    setTimerRunning(false);
  
    // Disable all option buttons after an option has been selected
    document.querySelectorAll('.option-box button').forEach(btn => {
      btn.disabled = true;
    });
  
    // Display the correct option in green and the selected option in red if incorrect
    document.querySelectorAll('.option-box button').forEach(btn => {
      const optionText = btn.textContent;
      if (optionText === currentQuestion.correctOption) {
        btn.style.backgroundColor = 'green'; // Highlight correct option green
      } else if (optionText === option && !isCorrect) {
        btn.style.backgroundColor = 'red'; // Highlight selected incorrect option red
      }
    });
  
    // Show "Next Question" button after user has answered
    document.querySelector('.next-question-btn').style.display = 'block';
  
    if (currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1) {
      setRoundFinished(true);
      updateFirestore(score + calculatedScore, updatedCorrectAnswers);
    }
  }
  
  
 // Modify nextQuestion function
function nextQuestion() {
  // Reset button styles and enable options for the next question
  document.querySelectorAll('.option-box button').forEach(btn => {
    btn.disabled = false;
    btn.style.backgroundColor = '';
  });

  setSelectedOption(null); // Reset selected option
  // Hide "Next Question" button
  document.querySelector('.next-question-btn').style.display = 'none';

  // Check if it's the last question in the round
  if (currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1) {
    // Hide "Next Question" button after it's clicked
    document.querySelector('.next-question-btn').style.display = 'none';

    // Check if the round is finished
    if (roundFinished) {
      // All questions in the round have been answered
      setAllQuestionsAnswered(true);
    } else {
      // Show "Finish Round" button
      document.querySelector('.finish-round-btn').style.display = 'block';
    }
  } else {
    // Proceed to the next question
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setTimer(10);
    setTimerRunning(true);
  }
}

  // Function to start the quiz
  async function startQuiz() {
    try {
      const usersCollection = collection(db, 'users');
      const userId  = user.uid;
      const userDocRef = doc(usersCollection, userId);
      if ((await getDoc(userDocRef)).exists()) {
        await updateDoc(userDocRef, {
          quizStarted: true,
          currentRound: 0
        });
        setTimerRunning(true)
        setQuizStarted(true);
      } else {
        console.error('Document does not exist. Cannot update score in Firestore.');
      }
    } catch (error) {
      console.error('Error updating score in Firestore:', error);
    }
  }

  async function startNextRound() {
    try {
      const usersCollection = collection(db, 'users');
      const userId  = user.uid;
      const userDocRef = doc(usersCollection, userId);
      if ((await getDoc(userDocRef)).exists()) {
        await updateDoc(userDocRef, {
          currentRound: currentRoundIndex +1,
          allQuestionsAnswered: false
        });
        setAllQuestionsAnswered(false)
        setCurrentRoundIndex(prevRoundIndex => prevRoundIndex + 1);
        setCurrentQuestionIndex(0);
        setRoundFinished(false);
        setTimer(10);
        setCountdown(5);
        setTimerRunning(true);
      } else {
        console.error('Document does not exist. Cannot update score in Firestore.');
      }
    } catch (error) {
      console.error('Error updating score in Firestore:', error);
    }
  }

  return (
    <div className='Quiz'>
      <div>
        {!quizStarted ? (
          // Initial screen before quiz starts
          <div className='StartScreen'>
            <p className='p1'>Round 1</p>
            <button className='start-btn' onClick={startQuiz}>
              Start
            </button>
          </div>
        ) :allQuestionsAnswered ? (
          <div className='CompletedRound'>
            <p className='p1'>Round {currentRoundIndex + 1} completed</p>
            <p className='p2'>Total correct answers: {correctAnswers}</p>
            <p className='p3'>Your score: {score}</p>
            {currentRoundIndex === questions.rounds.length - 1 ? (
              <p className='p4'>Thank you for playing. View your final score in the leaderboard.</p>
            ) : (
              <>
                {allQuestionsAnswered && <p>{countdown > 0 ? `Next Round starts in: ${countdown}` : ''}</p>}
                {allQuestionsAnswered && countdown < 1 && <button onClick={startNextRound}>Start Round {currentRoundIndex + 2}</button>}
              </>
            )}
          </div>
        ) : (
          
          <div className='Quiz-main'>
            <p>{currentQuestion.text}</p>
            <p className='Timer'>{timer}</p>
            <div className='quiz-container'>
              <ul>
                {questions.rounds[currentRoundIndex].questions[currentQuestionIndex].options.map((option, index) => (
                  <li key={index} className='option-box'>
                    <button
                      onClick={() => scoreUpdate(option)}
                      className={selectedOption === option ? 'selected' : ''}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className='score'>Score: {score}</p>
            <button className='next-question-btn' onClick={nextQuestion} style={{ display: 'none' }}>
              {currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1 ? 'Finish Round' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;