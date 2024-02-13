import React, { useState, useEffect } from 'react';
import './App.css';
import questions from '../Assets/question';

function Quiz({ score, setScore }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10); // Initial timer value is 10 seconds
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          // If timer reaches 1, move to the next question
          nextQuestion();
          return 10; // Reset timer for the next question
        }
        return prevTimer - 1;
      });
    }, 1000);
    // Cleanup the interval on component unmount or when moving to the next question
    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  function scoreUpdate(selectedOption) {
    // Calculate the score based on the time taken
    const timeFactor = 0.2; // Adjust this factor based on how much time should affect the score
    const maxScore = 10; // Maximum score for a question
    const timeRemaining = timer; // Use timer or some modified value depending on your logic

    // Calculate the score with a formula (adjust the formula as needed)
    const calculatedScore = Math.max(maxScore - timeRemaining * timeFactor, 0);

    setScore((prevScore) => prevScore + calculatedScore);
    nextQuestion();
  }

  function nextQuestion() {
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex >= questions.length - 1) return 0;
      return prevIndex + 1;
    });
    setTimer(10); // Reset the timer for the next question
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
