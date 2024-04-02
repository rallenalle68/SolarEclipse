import React, { useState, useEffect } from 'react';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';

const SolarEclipse = () =>{
  const firstContactBegins = new Date('April 8, 2024 14:02:00');
  
  const totalityBegins = new Date('April 8, 2024 15:16:23');
  
  const lastContactBegins = new Date('April 8, 2024 15:20:05');
  const lastContactEnds = new Date('April 8, 2024 16:30:00');

  const [timeRemaining5, setTimeRemaining5] = useState(calculateTimeRemaining(5));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining5(calculateTimeRemaining(5));
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
    if(phase === 2) {
      time = firstContactBegins;
    } else if (phase === 3) {
      time = totalityBegins;
    } else if (phase === 4) {
      time = lastContactBegins;
    } else if (phase === 5){
      time = lastContactEnds;
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
    if (now > lastContactBegins) {
      return 4;
    } else if (now > totalityBegins) {
      return 3;
    } else if (now > firstContactBegins) {
      return 2;
    } else {
      return 1;
    }
  }

return(
    <div className='SolarEclipse'>
              <div className='InfoParagraphs'>
                <p className='p1' style={{backgroundColor:'rgb(18, 133, 18)'}}>Eclipse timeline</p>
                <p className='p3' style={{backgroundColor:'rgb(18, 133, 18)', color:'whitesmoke'}}>We will experience 3 stages of the eclipse.</p>
                <p className='p3' style={{backgroundColor:'rgb(18, 133, 18)', color:'whitesmoke'}}>Make sure to stay updated on safety!</p>
              </div>
        <div className='Phases'>
            <div className='Phase-2' onClick={toggleAcordion2} style={{position: 'relative', opacity: (currentPhase === 2 || currentPhase === 0 || isOpen2) ? 1 : 0.7,}}>
              <div className='SolarTimer'>
                  <div>
                    <p className='p2'>First contact starts in:</p>
                  </div>
                  <div className='timerContainer'>
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
                  <div>
                    <p className='p2'>First contact ends in:</p>
                  </div>
                  <div className='timerContainer'>
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
                </div>
                <div>
                  {isOpen2 ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
                {isOpen2 && 
                <ul>
                  <li style={{fontSize: 22}}>!!Observe ONLY WITH eclipse glasses or solar filters!!</li>
                </ul>}
            </div>
            
            <div className='Phase-3' onClick={toggleAcordion3} style={{opacity: (currentPhase === 3 || currentPhase === 0 || isOpen3) ? 1 : 0.7,}}>
              <div>
              </div>
                <div className='SolarTimer'>
                  <div>
                    <p className='p2'>Totality starts in:</p>
                  </div>
                  <div className='timerContainer'>
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
                  <div>
                    <p className='p2'>Totality ends in:</p>
                  </div>
                  <div className='timerContainer'>
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
                </div>
                <div>
                  {isOpen3 ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </div>
                {isOpen3 && 
                <ul>
                  <li style={{fontSize: 22}}>Safe to observe without glasses!</li>
                </ul>}

            </div>
            <div className='Phase-4' onClick={toggleAcordion4} style={{position: 'relative', opacity: (currentPhase === 4 || currentPhase === 0 || isOpen4) ? 1 : 0.7,}}>
              <div className='SolarTimer'>
                    <div>
                      <p className='p2'>Last contact starts in:</p>
                    </div>
                    <div className='timerContainer'>
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
                    <div>
                      <p className='p2'>Solar eclipse ends in:</p>
                    </div>
                    <div className='timerContainer'>
                      <div>
                        <p className='SolarTime'>{timeRemaining5.days}</p>
                        <p>days</p>
                      </div>
                      <div>
                        <p className='SolarTime'>{timeRemaining5.hours}</p>
                        <p>Hours</p>
                      </div>
                      <div>
                        <p className='SolarTime'>{timeRemaining5.minutes}</p>
                        <p>Minutes</p>
                      </div>
                      <div>
                        <p className='SolarTime'>{timeRemaining5.seconds}</p>
                        <p>seconds</p>
                      </div>
                    </div>
                  </div>
                <div>
                  {isOpen4 ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
                {isOpen4 && 
                <ul>
                  <li style={{fontSize: 22}}>!!Observe ONLY WITH eclipse glasses or solar filters!!</li>
                </ul>}
            </div>
        </div>

    </div>
);
}

export default SolarEclipse;
