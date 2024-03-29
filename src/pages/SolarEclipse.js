import React, { useState, useEffect } from 'react';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';

const SolarEclipse = () =>{
  const phase1 = new Date('April 8, 2024 14:02:00');
  const phase2 = new Date('April 8, 2024 15:16:23');
  const phase3 = new Date('April 8, 2024 15:20:05');
  const phase4 = new Date('April 8, 2024 16:43:57');

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
    setTimeRemaining4(calculateTimeRemaining(4));
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

        <h2 style={{fontSize: '2rem'}}>Eclipse timeline</h2>
            
        <div className='Phases'>
            <div className='Phase 2' onClick={toggleAcordion2} style={{position: 'relative', opacity: (currentPhase === 2 || currentPhase === 0 || isOpen2) ? 1 : 0.7,}}>
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
                <h2>First contact</h2>
                <div>
                  {isOpen2 ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
                {isOpen2 && 
                <ul>
                  <li style={{listStyleType: 'circle', fontSize: 22}}>!!Observe ONLY WITH eclipse glasses or solar filters!!</li>
                </ul>}
            </div>
            
            <div className='Phase 3' onClick={toggleAcordion3} style={{opacity: (currentPhase === 3 || currentPhase === 0 || isOpen3) ? 1 : 0.7,}}>
              <div>
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
                <h2>TOTALITY!</h2>
                <div>
                  {isOpen3 ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
                {isOpen3 && 
                <ul>
                  <li style={{listStyleType: 'circle', fontSize: 22}}>Safe to observe without glasses!</li>
                </ul>}

            </div>
            <div className='Phase 4' onClick={toggleAcordion4} style={{position: 'relative', opacity: (currentPhase === 4 || currentPhase === 0 || isOpen4) ? 1 : 0.7,}}>
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
                <h2>Last Contact</h2>
                <div>
                  {isOpen4 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
                {isOpen4 && 
                <ul>
                  <li style={{listStyleType: 'circle', fontSize: 22}}>!!Observe ONLY WITH eclipse glasses or solar filters!!</li>
                </ul>}
            </div>
        </div>

    </div>
);
}

export default SolarEclipse;
