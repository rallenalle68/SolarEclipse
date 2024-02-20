import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/question';
import { db } from '../Assets/firebase-config';
// Import necessary Firestore functions
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";

function Quiz({ score, setScore, user }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10); // Initial timer value is 10 seconds
  const currentQuestion = questions[currentQuestionIndex];
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);


  // useEffect(() => {
  //   if(!allQuestionsAnswered){
  //     const interval = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer === 1) {
  //           // If timer reaches 1, move to the next question
  //           nextQuestion();
  //           return 10; // Reset timer for the next question
  //         }
  //         return prevTimer - 1;
  //       });
  //     }, 1000);
  //     // Cleanup the interval on component unmount or when moving to the next question
  //     return () => clearInterval(interval);
  //   }
  // }, [currentQuestionIndex, allQuestionsAnswered]);

  
  async function updateScoreInFirestore(score) {
    const usersCollection = collection(db, 'users');
    const userId = user.uid;
    const userDocRef = doc(usersCollection, userId);
    
    if ((await getDoc(userDocRef)).exists()) {
      updateDoc(userDocRef, { score: score })
      .then(() => {
        console.log('Score successfully updated in Firestore');
      })
      .catch((error) => {
        console.error('Error updating score in Firestore:', error);
      });
    } else {
      console.error('Document does not exist. Cannot update score.');
    }
  }

  function scoreUpdate(selectedOption) {
    const isCorrect = selectedOption === currentQuestion.correctOption;

    setScore((prevScore) => {
      const calculatedScore = timer;
      return prevScore + (isCorrect ? calculatedScore : 0);
    });

    setCorrectAnswers((prevCorrectAnswers) => (isCorrect ? prevCorrectAnswers + 1 : prevCorrectAnswers));

    if (currentQuestionIndex === questions.length - 1) {
      setAllQuestionsAnswered(true);
      clearInterval(); // Stop the timer when all questions are answered
    } else {
      nextQuestion();
    }
  }

  function nextQuestion() {
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex >= questions.length - 1) {
        setAllQuestionsAnswered(true);
        updateScoreInFirestore(score);
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
