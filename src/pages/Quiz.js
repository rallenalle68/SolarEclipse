import React, { useState } from 'react';
import './App.css';
import questions from '../Assets/question';

function Quiz({score, setScore}) {
    // Quiz Component
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    const currentQuestion = questions[currentQuestionIndex];
    
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
      <div>
        <h2>Question {currentQuestion.id}</h2>
        <p>{currentQuestion.text}</p>
        <ul>
          {currentQuestion.options.map((option, index) => (
            <li key={index}>
              <button onClick={() => scoreUpdate(option)}>{option}</button>
            </li>
          ))}
        </ul>
        <p>Score: {score}</p>
      </div>
    );
  }

  export default Quiz;