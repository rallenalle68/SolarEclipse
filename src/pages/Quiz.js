import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/questions.json'; // Import the JSON file
import { db, realtimeDb } from '../Assets/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

import { ref, onValue, off, update } from 'firebase/database'; // Import Realtime Database functions

function Quiz({ score, setScore, user }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [userName, setUsername] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentQuestion = questions.rounds[currentRoundIndex].questions[currentQuestionIndex];
  const [roundFinished, setRoundFinished] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const quizStateRef = ref(realtimeDb, `users/${user.uid}`);
  
    onValue(quizStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTimer(data.timer || 10);
        setCurrentQuestionIndex(data.currentQuestion || 0);
        setCorrectAnswers(data.correctAnswers || 0);
        setAllQuestionsAnswered(data.allQuestionsAnswered || false);
        setUsername(data.username || "");
        setQuizStarted(data.quizStarted || false);
        setTimerRunning(data.timerRunning || false);
        setCurrentRoundIndex(data.currentRound || 0);
        setRoundFinished(data.roundFinished || false);
        setCountdown(data.countdown || 5);
        setScore(data.score || 0);
        setSelectedOption(data.selectedOption || null); // Fetch selected option
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
        } else if (optionText === selectedOption && optionText !== currentQuestion.correctOption) {
          btn.style.backgroundColor = 'red'; // Highlight selected incorrect option red
        } else {
          btn.style.backgroundColor = ''; // Clear background color for other options
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
    const interval = setInterval(() => {
      if (timerRunning && timer > 0) {
        setTimer(prevTimer => prevTimer - 1);
      } else if (timer === 0) {
        // Handle timer reaching 0, for example, move to the next question or finish the quiz
        nextQuestion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timer]);


  useEffect(() => {
    let intervalId;
  
    function startCountdown() {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId); // Clear the interval when countdown reaches 0
            return 0;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  
    if (allQuestionsAnswered) {
      startCountdown(); // Start the countdown if all questions are answered and countdown is not already in progress
    }
  
    // Clean up the interval when component unmounts or countdown is reset
    return () => clearInterval(intervalId);
  }, [allQuestionsAnswered, countdown]);


  async function updateRealtimeDB(option, score, correctAnswers) {
    if (option == 1){
      try {
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await update(userRef, {
          timerRunning: false,
          timer: timer,
          score: score,
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
          timer: 10,
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
          timer: 10,
          selectedOption: null
        });
      } catch (error) {
        
      }
    }
  }
  

  async function updateLeaderBoard(score) {

    try {
        // Get the user document reference
        const userDocRef = doc(collection(db, 'leaderboard'), user.uid);
        const round1DocRef = doc(collection(db, 'round1'), user.uid);
        
        // Check if the user already has an entry in the leaderboard
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) {
            // Update existing entry in the leaderboard
            await updateDoc(userDocRef, { username: userName, score: score });
        } else {
            // Add a new entry to the leaderboard
            await setDoc(userDocRef, { username: userName, score: score });
        }
    } catch (error) {
        
    }
}


  function nextQuestion() {
    // Reset selected option and button styles
    setSelectedOption(null);
    document.querySelectorAll('.option-box button').forEach(btn => {
      btn.disabled = false;
      btn.style.backgroundColor = '';
    });
  
    // Check if it's the last question in the round
    const isLastQuestion = currentQuestionIndex === questions.rounds[currentRoundIndex].questions.length - 1;
  
    if (isLastQuestion) {
      // Hide "Next Question" button after it's clicked
      const nextQuestionButton = document.querySelector('.next-question-btn');
      if (nextQuestionButton) {
        nextQuestionButton.style.display = 'none';
      }
  
      // Hide "Finish Round" button after it's clicked
      const finishRoundButton = document.querySelector('.finish-round-btn');
      if (finishRoundButton) {
        finishRoundButton.style.display = 'none';
      }
  
      // Set allQuestionsAnswered to true and update the realtime database
      setAllQuestionsAnswered(true);
      updateRealtimeDB(3, score, correctAnswers); // Update realtime database
      updateLeaderBoard(score);
    } else {
      // Proceed to the next question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(10); // Reset timer to 10 seconds
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
    updateRealtimeDB(1, score +calculatedScore, updatedCorrectAnswers);
  
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
      } else if (optionText === option && !isCorrect) {
        btn.style.backgroundColor = 'red'; // Highlight selected incorrect option red
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
      setTimer(10);
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
      setRoundFinished(false);
      setTimer(10);
      setCountdown(5);
      setTimerRunning(true);
    } catch (error) {
    }
  }
  // useEffect(() => {
  //   // Function to calculate the remaining time until April 8, 2024, at 1:00 PM
  //   function calculateCountdown() {
  //     // Target time: April 8, 2024, 13:00:00
  //     const targetTime = new Date('April 8, 2024 13:00:00');
  
  //     // Current date and time
  //     const now = new Date();
  
  //     // Calculate the time difference in milliseconds
  //     const timeDiff = targetTime.getTime() - now.getTime();
  
  //     // Convert time difference to hours, minutes, and seconds
  //     const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  //     const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  //     // Format the remaining time as a string
  //     const formattedCountdown = `${hours.toString().padStart(2, '0')}:
  //       ${minutes.toString().padStart(2, '0')}:
  //       ${seconds.toString().padStart(2, '0')}`;
  
  //     // Update the countdown state
  //     setCountdown(formattedCountdown);
  
  //     // Update the countdown every second
  //     setTimeout(calculateCountdown, 1000);
  //   }
  
  //   // Start the countdown
  //   calculateCountdown();
  
  //   // Clean up the setTimeout when component unmounts
  //   return () => clearTimeout(calculateCountdown);
  // }, []);
  

  return (
    <div className='Quiz'>
      <div>
        {!quizStarted ? (
          // Initial screen before quiz starts
          <div className='StartScreen'>
            <div className='InfoParagraphs'>
              <p className='p1'>Welcome to the quiz!</p>
              <p style={{marginTop:24, fontSize:20}}>Be ready for 4 rounds.</p>
              <p style={{marginTop:24, fontSize:20}}>Each question has a countdown.</p>
              <p style={{fontSize:20}}>The faster you answere, the more points you get.</p>
              <p style={{marginTop:24, fontSize:16}}>To be able to answere the questions in the quiz.</p> 
              <p style={{fontSize:16}}>We recommend to read the information boxes.</p> 
            </div>
            <button className='start-btn' onClick={startQuiz}>
              Start round 1
            </button>
          </div>
        ) :allQuestionsAnswered ? (
          <div className='CompletedRound'>
            <p className='p1'>Round {currentRoundIndex} completed</p>
            <p className='p2'>Total correct answers: {correctAnswers}</p>
            <p className='p3'>Your score: {score}</p>
            {currentRoundIndex === questions.rounds.length-1 ? (
              <p className='p4'>Thank you for playing. View your final score in the leaderboard.</p>
            ) : (
              <>
                {allQuestionsAnswered && <p>{countdown > 0 ? `Next Round starts in: ${countdown}` : ''}</p>}
                {allQuestionsAnswered && countdown < 1 && <button onClick={startNextRound}>Start Round {currentRoundIndex + 1}</button>}
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