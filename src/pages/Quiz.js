import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/question';

function Quiz({score, setScore}) {
    // Quiz Component
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(5); // Initial timer value is 5 seconds
    const currentQuestion = questions[currentQuestionIndex];
    
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setTimer(prevTimer => {
  //         if (prevTimer === 1) {
  //           // If timer reaches 1, move to the next question
  //           nextQuestion();
  //           return 5; // Reset timer for the next question
  //         }
  //         return prevTimer - 1;
  //       });
  //     }, 1000);
  //     // Cleanup the interval on component unmount or when moving to the next question
  //   return () => clearInterval(interval);
  // }, [currentQuestionIndex]);


    function scoreUpdate(selectedOption){
      if(selectedOption === currentQuestion.correctOption){
        setScore(prevScore => prevScore +1);
  
      }
      nextQuestion();
    }
    function nextQuestion(){
      setCurrentQuestionIndex(prevIndex =>{
        if(prevIndex >= questions.length -1)return 0;
        return prevIndex +1;
      })
    }
    return (
      <div className='Quiz'>
        <div className='Quiz-main'>
        <h2>Question {currentQuestion.id}</h2>
            <p className='score'>Score: {score}</p>
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
      </div>
      </div>
    );
  }

  export default Quiz;