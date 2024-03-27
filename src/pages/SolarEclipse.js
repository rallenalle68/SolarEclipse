import React, { useState, useEffect } from 'react';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';

const SolarEclipse = () =>{
  const phase1 = new Date('April 8, 2024 13:00:00');
  const phase2 = new Date('April 8, 2024 13:15:00');
  const phase3 = new Date('April 8, 2024 13:30:00');
  const phase4 = new Date('April 8, 2024 13:45:00');

  const [timeRemaining1, setTimeRemaining1] = useState(calculateTimeRemaining(1));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining1(calculateTimeRemaining(1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const [timeRemaining2, setTimeRemaining2] = useState(calculateTimeRemaining(2));
useEffect(() => {
  const interval = setInterval(() => {
    setTimeRemaining2(calculateTimeRemaining(2));
  }, 1000);

  return () => clearInterval(interval);
}, []);

const [timeRemaining3, setTimeRemaining3] = useState(calculateTimeRemaining(3));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining3(calculateTimeRemaining(3));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const [timeRemaining4, setTimeRemaining4] = useState(calculateTimeRemaining(4));
useEffect(() => {
  const interval = setInterval(() => {
    setTimeRemaining3(calculateTimeRemaining(4));
  }, 1000);

  return () => clearInterval(interval);
}, []);

  function calculateTimeRemaining(phase) {
    let time;
    const now = new Date();
    if(phase === 1) {
      time = phase1;
    } else if (phase === 2) {
      time = phase2;
    } else if (phase === 3) {
      time = phase3;
    } else if (phase === 4) {
      time = phase4;
    }
    const difference = time - now;

    if (difference <= 0) {
      // If the target date has passed, return 0 for all fields
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return ({ days, hours, minutes, seconds });
  }

  const [isOpen1, setIsOpen1] = useState(false);
  const toggleAcordion1 = () => {
      setIsOpen1(!isOpen1);
  }

  const [isOpen2, setIsOpen2] = useState(false);
  const toggleAcordion2 = () => {
      setIsOpen2(!isOpen2);
  }

  const [isOpen3, setIsOpen3] = useState(false);
  const toggleAcordion3 = () => {
      setIsOpen3(!isOpen3);
  }

  const [isOpen4, setIsOpen4] = useState(false);
  const toggleAcordion4 = () => {
      setIsOpen4(!isOpen4);
  }

  const [currentPhase, setCurrentPhase] = useState(getCurrentPhase());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(getCurrentPhase());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getCurrentPhase() {
    const now = new Date();
    if (now < phase1) {
      return 1;
    } else if (now < phase2) {
      return 2;
    } else if (now < phase3) {
      return 3;
    } else if (now < phase4) {
      return 4;
    } else {
      return 0;
    }
  }

return(
    <div className='SolarEclipse'>

        {/* <div className='SunContainer'>
          <div className='Sun'></div>
          <div className='Moon'></div>
        </div> */}

        <h2 style={{fontSize: '2rem'}}>Countdown for Solar Eclipse Phases</h2>
            
        <div className='Phases'>
            <div className='Phase 1' onClick={toggleAcordion1} style={{position: 'relative', opacity: (currentPhase === 1 || currentPhase === 0 || isOpen1) ? 1 : 0.5,}}>
              <div style={
                {
                backgroundColor: isOpen1 ? 'orange' : 'white',
                color: isOpen1 ? 'white' : 'black',
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
                {isOpen1 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
              <div className='SolarTimer'>
                <div>
                  <p className='SolarTime'>{timeRemaining1.days}</p>
                  <p>days</p>
                </div>
                <div>
                  <p className='SolarTime'>{timeRemaining1.hours}</p>
                  <p>Hours</p>
                </div>
                <div>
                  <p className='SolarTime'>{timeRemaining1.minutes}</p>
                  <p>Minutes</p>
                </div>
                <div>
                  <p className='SolarTime'>{timeRemaining1.seconds}</p>
                  <p>seconds</p>
                </div>
              </div>
              <h2>Phase 1</h2>
              <h4 style={{fontSize: '1.2rem'}}>Safety Instruction</h4>
              {isOpen1 && 
              <ul>
                <li style={{listStyleType: 'circle'}}>Safety instruction 1</li>
                <li style={{listStyleType: 'circle'}}>Safety instruction 2</li> 
                <li style={{listStyleType: 'circle'}}>Safety instruction 3</li>
              </ul>}
            </div>
            <div className='Phase 2' onClick={toggleAcordion2} style={{position: 'relative', opacity: (currentPhase === 2 || currentPhase === 0 || isOpen2) ? 1 : 0.5,}}>
              <div style={{
                  backgroundColor: isOpen2 ? 'orange' : 'white',
                  color: isOpen2 ? 'white' : 'black',
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
                  {isOpen2 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
              <div className='SolarTimer'>
                  <div>
                    <p className='SolarTime'>{timeRemaining2.days}</p>
                    <p>days</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining2.hours}</p>
                    <p>Hours</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining2.minutes}</p>
                    <p>Minutes</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining2.seconds}</p>
                    <p>seconds</p>
                  </div>
                </div>
                <h2>Phase 2</h2>
                <h4 style={{fontSize: '1.2rem'}}>Safety Instruction</h4>
                {isOpen2 && 
                <ul>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 1</li>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 2</li> 
                  <li style={{listStyleType: 'circle'}}>Safety instruction 3</li>
                </ul>}
            </div>
            
            <div className='Phase 3' onClick={toggleAcordion3} style={{position: 'relative', opacity: (currentPhase === 3 || currentPhase === 0 || isOpen3) ? 1 : 0.5,}}>
              <div style={{
                  backgroundColor: isOpen3 ? 'orange' : 'white',
                  color: isOpen3 ? 'white' : 'black',
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
                  {isOpen3 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
              <div className='SolarTimer'>
                  <div>
                    <p className='SolarTime'>{timeRemaining3.days}</p>
                    <p>days</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining3.hours}</p>
                    <p>Hours</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining3.minutes}</p>
                    <p>Minutes</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining3.seconds}</p>
                    <p>seconds</p>
                  </div>
                </div>
                <h2>Phase 3</h2>
                <h4 style={{fontSize: '1.2rem'}}>Safety Instruction</h4>
                {isOpen3 && 
                <ul>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 1</li>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 2</li> 
                  <li style={{listStyleType: 'circle'}}>Safety instruction 3</li>
                </ul>}

            </div>
            <div className='Phase 4' onClick={toggleAcordion4} style={{position: 'relative', opacity: (currentPhase === 4 || currentPhase === 0 || isOpen4) ? 1 : 0.5,}}>
              <div style={{
                  backgroundColor: isOpen4 ? 'orange' : 'white',
                  color: isOpen4 ? 'white' : 'black',
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
                  {isOpen4 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
              <div className='SolarTimer'>
                  <div>
                    <p className='SolarTime'>{timeRemaining4.days}</p>
                    <p>days</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining4.hours}</p>
                    <p>Hours</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining4.minutes}</p>
                    <p>Minutes</p>
                  </div>
                  <div>
                    <p className='SolarTime'>{timeRemaining4.seconds}</p>
                    <p>seconds</p>
                  </div>
                </div>
                <h2>Phase 4</h2>
                <h4 style={{fontSize: '1.2rem'}}>Safety Instruction</h4>
                {isOpen4 && 
                <ul>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 1</li>
                  <li style={{listStyleType: 'circle'}}>Safety instruction 2</li> 
                  <li style={{listStyleType: 'circle'}}>Safety instruction 3</li>
                </ul>}
            </div>
        </div>

    </div>
);
}

export default SolarEclipse;
