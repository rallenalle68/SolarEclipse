import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/questions.json'; // Import the JSON file
import { db, realtimeDb } from '../Assets/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

import { ref, onValue, off, update } from 'firebase/database'; // Import Realtime Database functions
import LoadingScreen from './LoadingScreen';

function Quiz({ user }) {
// UI state
const [loadingScreen, setLoading] = useState(true); 
const [quizClosed, setQuizClosed] = useState(true);
// User state
const [userName, setUsername] = useState(""); 

// Timer state
const currentTime = new Date(); 
const [timer, setTimer] = useState(15); 
const [timerRunning, setTimerRunning] = useState(false); 

// Countdown state
const [targetTime, setTargetTime] = useState(new Date()); 
const [countdown, setCountdown] = useState({ full: '', simple: '' }); 
const [timeDiff, setTimeDiff] = useState(0); 

// User progress state
const [quizStarted, setQuizStarted] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
const [currentRoundIndex, setCurrentRoundIndex] = useState(0); 
const currentQuestion = questions.rounds[currentRoundIndex].questions[currentQuestionIndex]; 
const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false); 
const [correctAnswers, setCorrectAnswers] = useState(0); 
const [selectedOption, setSelectedOption] = useState(null);
// Round-specific state
const [roundActive1, setRoundActive1] = useState(false); 
const [score, setScore] = useState(0);  
const [roundscore, setRoundScore] = useState(0);


  useEffect(() => {
    const quizStateRef = ref(realtimeDb, `users/${user.uid}`);
  
    onValue(quizStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTimer(data.timer || 15);
        setCurrentQuestionIndex(data.currentQuestion || 0);
        setCorrectAnswers(data.correctAnswers || 0);
        setAllQuestionsAnswered(data.allQuestionsAnswered || false);
        setUsername(data.username || "");
        setQuizStarted(data.quizStarted || false);
        setTimerRunning(data.timerRunning || false);
        setCurrentRoundIndex(data.currentRound || 0);
        setRoundScore(data[`round${data.currentRound+1}score`] || 0);
        setScore(data.score || 0);
        setSelectedOption(data.selectedOption || null); // Fetch selected option
        setLoading(false)
      }
    });

    // Clean up the listener when component unmounts
    return () => {
      off(quizStateRef);
    };
  }, [user, setScore]);

  useEffect(() => {
    // Call the function to disable other options after the component mounts
    if (selectedOption !== null) {
      disableOtherOptions(selectedOption);
    }
  }, [selectedOption, currentQuestion.correctOption]);

  function disableOtherOptions(selectedOption) {
    let allOptionsDisabled = true; // Flag to track if all options are disabled
    document.querySelectorAll('.option-box button').forEach(btn => {
      if (btn) { // Check if btn is not null
        btn.disabled = true;
        const optionText = btn.textContent;
        if (optionText === currentQuestion.correctOption) {
          btn.style.backgroundColor = 'green'; // Highlight correct option green
          btn.style.color = 'white';
        } else if (optionText === selectedOption && optionText !== currentQuestion.correctOption) {
          btn.style.backgroundColor = 'red'; // Highlight selected incorrect option red
        } else {
          btn.style.backgroundColor = ''; // Clear background color for other options
          btn.style.color = 'black';
        }
  
        // Check if any option is still enabled
        if (!btn.disabled) {
          allOptionsDisabled = false;
        }
      }
    });
  
    // Show "Next Question" button if all options are disabled
    if (allOptionsDisabled) {
      const nextQuestionButton = document.querySelector('.next-question-btn');
      if (nextQuestionButton) {
        nextQuestionButton.style.display = 'block';
      }
    }
  }
  
  
  useEffect(() => {
    const userRef = ref(realtimeDb, `users/${user.uid}`);
    const interval = setInterval(() => {
      if (timerRunning && timer > 0) {
        setTimer(prevTimer => {
          const newTimer = prevTimer - 1;
          update(userRef, {
            timer: newTimer, // Update with the decremented value
          });
          return newTimer; // Return the decremented value for state update
        });
      } else if (timer <= 1) {
        // Handle timer reaching 0, for example, move to the next question or finish the quiz
        scoreUpdate("Incorrect");
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timerRunning, timer]);


  async function updateRealtimeDB(option, calculatedScore, correctAnswers) {
    console.log(roundscore)
    console.log(currentRoundIndex +1)
    if (option == 1){
      try {
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await update(userRef, {
          timerRunning: false,
          timer: timer,
          [`round${currentRoundIndex+1}score`]: roundscore + calculatedScore,
          score: score + calculatedScore,
          correctAnswers: correctAnswers
        });
      } catch (error) {
      }
    } else if (option === 2){
      try {
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await update(userRef, {
          timerRunning: true,
          currentQuestion: currentQuestionIndex +1,
          timer: 15,
          selectedOption: null,
        });
      } catch (error) {
        
      }
    } else if (option === 3){
      try {
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await update(userRef, {
          timerRunning: false,
          currentQuestion: 0,
          currentRound: currentRoundIndex +1,
          allQuestionsAnswered: true,
          timer: 15,
          selectedOption: null
        });
      } catch (error) {
        
      }
    }
  }

  async function updateLeaderBoard(roundscore) {
    try {
      const userDocRef = doc(collection(db, `Round${currentRoundIndex + 1}`), user.uid);
      
      // Check if the user already has an entry in the round's collection
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        // Update existing entry in the round's collection
        await updateDoc(userDocRef, { score: roundscore, username:userName });
      } else {
        // Add a new entry to the round's collection
        await setDoc(userDocRef, { score: roundscore, username:userName });
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
    try {
      // Always update the document in the Round5 collection
      const totalDocRef = doc(collection(db, `Round5`), user.uid);
      // Update the document with the score
      await setDoc(totalDocRef, { score: score, username:userName });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }


  function nextQuestion() {
    // Reset selected option and button styles
    setSelectedOption(null);
    document.querySelectorAll('.option-box button').forEach(btn => {
      btn.disabled = false;
      btn.style.backgroundColor = '';
      btn.style.color = 'black';
    });
    
    // Hide "Finish Round" button after it's clicked
    const nextQuestionButton = document.querySelector('.next-question-btn');
    if (nextQuestionButton) {
      nextQuestionButton.style.display = 'none';
    }

    // Check if it's the last question in the round
    const isLastQuestion = currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1;
  
    if (isLastQuestion) {
      // Hide "Next Question" button after it's clicked
  
      const finishRoundButton = document.querySelector('.finish-round-btn');
      if (finishRoundButton) {
        finishRoundButton.style.display = 'none';
      }
  
      // Set allQuestionsAnswered to true and update the realtime database
      setAllQuestionsAnswered(true);
      updateRealtimeDB(3, 0, correctAnswers); // Update realtime database
      updateLeaderBoard(roundscore);
    } else {
      // Proceed to the next question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(15); // Reset timer to 10 seconds
      setTimerRunning(true);
      setSelectedOption(null);
      updateRealtimeDB(2, 0, 0); // Update realtime database
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
    updateRealtimeDB(1, calculatedScore, updatedCorrectAnswers);
  
    const userRef = ref(realtimeDb, `users/${user.uid}`);
    update(userRef, { selectedOption: option });
  
    // Disable all option buttons if the timer is not running
    if (!timerRunning) {
      document.querySelectorAll('.option-box button').forEach(btn => {
        btn.disabled = true;
      });
    }
  
    // Display the correct option in green and the selected option in red if incorrect
    document.querySelectorAll('.option-box button').forEach(btn => {
      const optionText = btn.textContent;
      if (optionText === currentQuestion.correctOption) {
        btn.style.backgroundColor = 'green'; // Highlight correct option green
        btn.style.color = 'white';
      } else if (optionText === option && !isCorrect) {
        btn.style.backgroundColor = 'red'; // Highlight selected incorrect option red
        btn.style.color = 'white';
      } else {
        btn.style.backgroundColor = ''; // Clear background color for other options
      }
    });
  
    // Check if it's the last question in the round
    const isLastQuestion = currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1;
  
    if (isLastQuestion) {
      // Show "Finish Round" button after user has answered the last question
      const finishRoundButton = document.querySelector('.finish-round-btn');
      if (finishRoundButton) {
        finishRoundButton.style.display = 'block';
      }
    } else {
      // Show "Next Question" button after user has answered the question
      const nextQuestionButton = document.querySelector('.next-question-btn');
      if (nextQuestionButton) {
        nextQuestionButton.textContent = 'Next Question';
        nextQuestionButton.style.display = 'block';
      }
    }
  }
  
  
  // Function to start the quiz
  async function startQuiz() {
    try {
      
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await update(userRef, {
        quizStarted: true,
        timerRunning: true,
        currentRound: 0,
        currentQuestion: 0,
        timer: 10, // Starting timer value
        });
        setCurrentRoundIndex(0);
        setCurrentQuestionIndex(0);
        setTimer(15);
        setTimerRunning(true);
        setQuizStarted(true);
      
    } catch (error) {
    }
  }

  async function startNextRound() {
    try {
      const userRef = ref(realtimeDb, `users/${user.uid}`);
      await update(userRef, {
        currentRound: currentRoundIndex,
        allQuestionsAnswered: false,
        timerRunning:true,
        currentQuestion: 0,
      });
      setAllQuestionsAnswered(false);
      setCurrentRoundIndex(currentRoundIndex);
      setCurrentQuestionIndex(0);
      setTimer(15);
      setTimerRunning(true);
    } catch (error) {
    }
  }


  useEffect(() => {
    // Function to calculate the remaining time until April 8, 2024, at 1:00 PM
    function calculateCountdown(currentRoundIndex) {
      // Define the start times for each round
      switch (currentRoundIndex) {
        case 0:
          setTargetTime(new Date('April 4, 2024 13:00:00'));
          if(targetTime.getTime() < currentTime.getTime()){
            setRoundActive1(true)
          }
          break;
        case 1:
          setTargetTime(new Date('April 8, 2024 13:15:00'));
          break;
        case 2:
          setTargetTime(new Date('April 8, 2024 13:30:00'));
          break;
        case 3:
          setTargetTime(new Date('April 8, 2024 13:45:00'));
          break;
        case 4:
          setTargetTime(new Date('April 8, 2024 14:45:00'));
          if(targetTime.getTime() < currentTime.getTime()){
            setQuizClosed(true)
          }
        default:
          setTargetTime(new Date('April 8, 2024 12:45:00'));
          // Set a default target time if currentRoundIndex is invalid
      }
  
      // Calculate the time difference in milliseconds
      let diff = targetTime.getTime() - new Date().getTime()
      setTimeDiff(diff); // Update currentTime here
      
      // Convert time difference to days, hours, minutes, and seconds
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
      // Format the remaining time as a string
      // Format the remaining time as a string for the main countdown
      const formattedCountdownFull = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

      // Format the remaining time as a string for the simplified countdown (minutes and seconds only)
      const formattedCountdownSimple = `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

      // Update the countdown states
      setCountdown({ full: formattedCountdownFull, simple: formattedCountdownSimple });
    }
  
    // Start the countdown initially
    calculateCountdown(currentRoundIndex);
  
    // Update the countdown every second
    const countdownInterval = setInterval(() => calculateCountdown(currentRoundIndex), 1000);
  
    // Clean up the setInterval when component unmounts
    return () => clearInterval(countdownInterval);
  }, [currentRoundIndex, timeDiff]); // Added currentRoundIndex as a dependency
  
  

  return (
    <div className='Quiz'>
      <div>
        {loadingScreen ? (
          <LoadingScreen/>
        ) :!loadingScreen && !quizStarted ? (
          // Initial screen before quiz starts
          <div className='StartScreen'>
            <div className='InfoParagraphs'>
              <p className='p1'>Welcome to the quiz!</p>
              <p className='p3'>A total of 4 rounds with 10 questions each.</p>
              <p className='p3'>Make sure to answer quickly, </p>
              <p className='p3'>but correctly ofcourse.</p>
            </div>
            {roundActive1 ?(
              <button className='start-btn' onClick={startQuiz}>
              Start round 1
            </button>
            ): (
              <>
              <p className='p2'>Round 1, April 8th 1pm, starts in:</p>
              <p className='p2'>{countdown.full}</p>
              </>
            )
            }
              <p className='p2'>Round 2: April 8th 1:15pm</p>
              <p className='p2'>Round 3: April 8th 1:30pm</p>
              <p className='p2'>Round 4: April 8th 1:45pm</p>
              <p className='p1'>Good luck!</p>
          </div>
        ) :allQuestionsAnswered ? (
          <div className='CompletedRound'>
            <p className='p1'>Round {currentRoundIndex} completed</p>
            <p className='p2'>Total correct answers: {correctAnswers}</p>
            <p className='p3'>Your total score: {score}</p>
            {currentRoundIndex === questions.rounds.length-1 ? (
              <p className='p4'>Thank you for playing. View your final score in the leaderboard.</p>
            ) : (
              <>
                {allQuestionsAnswered && <p>{timeDiff > 0 ? `Next Round starts in: ${countdown.simple}` : ''}</p>}
                {allQuestionsAnswered && timeDiff < 1 && <button onClick={startNextRound}>Start Round {currentRoundIndex + 1}</button>}
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