import React, { useState, useEffect } from 'react';

const solarEclipseDate = new Date('April 8, 2024 13:00:00');
const SolarEclipse = () =>{

const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function calculateTimeRemaining() {
    const now = new Date();
    const difference = solarEclipseDate - now;

    if (difference <= 0) {
      // If the target date has passed, return 0 for all fields
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

return(
    <div className='SolarEclipse'>
        <h2>Solar Eclipse Countdown</h2>
            <p>
                {timeRemaining.days} days, {timeRemaining.hours} hours, {timeRemaining.minutes} minutes,{' '}
                {timeRemaining.seconds}
            </p>
        <div className='Phases'>
            <div className='Phase 1'>
                <h2>Phase 1</h2>
            </div>
            <div className='Phase 2'>
                <h2>Phase 2</h2>
            </div>
            
            <div className='Phase 3'>
                <h2>Phase 3</h2>

            </div>
            <div className='Phase 4'>
                <h2>Phase 4</h2>
            </div>
        </div>

    </div>
);
}

export default SolarEclipse;