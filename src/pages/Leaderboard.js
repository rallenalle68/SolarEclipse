import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from '../Assets/firebase-config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../Assets/firebase-config';
import Podium from '../Component/Podium'

function Leaderboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(null);

  const [round, setRound] = useState(5); // Set default round to 5
  const [topThree, setTopThree] = useState([]);
  
  useEffect(() => {
    if (user) {
      fetchUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (userName !== "") {
      fetchLeaderboardData(userName, round); // Fetch leaderboard data with the initial round
    }
  }, [userName, round]); // Add 'round' as a dependency

  const fetchUserData = async (user) => {
    try {
      const userRef = ref(realtimeDb, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUserName(userData.username);
        }
      });
    } catch (error) {
      console.error('Error fetching user data from Realtime Database:', error);
    }
  };

  const fetchLeaderboardData = async (userName, round) => {
    try {
      const roundCollection = collection(db, `Round${round}`);
      const roundQuery = query(roundCollection, orderBy('score', 'desc'));
  
      const querySnapshot = await getDocs(roundQuery);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Set the sorted data in the state with only the top 10
      setLeaderboardData(data.slice(0, 10));
      setTopThree(data.slice(0,3));
  
      // Set the user's rank and score in the state
      const userEntry = leaderboardData.find(entry => entry.username === userName);
  
      if (userEntry) {
        setUserRank(userEntry.rank);
        setUserScore(userEntry.score);
      } else {
        // If the user is not in the top 10, find their rank using data
        const userData = data.find(entry => entry.username === userName);
        if (userData) {
          setUserRank(data.indexOf(userData) + 1);
          setUserScore(userData.score);
        } else {
          // User not found in the entire data
          setUserRank(null);
          setUserScore(null);
        }
      }
    } catch (error) {
      console.error(`Error fetching leaderboard data for Round${round}:`, error);
    }
  };

  const handleClickRound = (round) => {
    setRound(round);
    document.getElementById('round1').style.backgroundColor = '';
    document.getElementById('round2').style.backgroundColor = '';
    document.getElementById('round3').style.backgroundColor = '';
    document.getElementById('round4').style.backgroundColor = '';
    document.getElementById('round5').style.backgroundColor = '';
    document.getElementById(`round${round}`).style.backgroundColor = 'rgb(245, 130, 25)';
    
    // Fetch leaderboard data for the selected round
    fetchLeaderboardData(userName, round);
  };

  useEffect(() => {
    // Initially select round 5 and fetch its leaderboard data
    handleClickRound(5);
  }, []);

  return (
    <>
      <div style={{paddingTop: '10px'}}>
        <button id='round1' onClick={() => handleClickRound(1)}>Round 1</button>
        <button id='round2' onClick={() => handleClickRound(2)}>Round 2</button>
        <button id='round3' onClick={() => handleClickRound(3)}>Round 3</button>
        <button id='round4' onClick={() => handleClickRound(4)}>Round 4</button>
        <button id='round5' onClick={() => handleClickRound(5)}>Total</button>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '1rem', 
        marginTop: '8px', 
        justifyContent: 'center',
        justifyItems: 'center',
        placeContent: 'center',
        contentAlign: 'end',
        alignItems: 'end',
        height: '250px', /* Adjust as needed */
        width: '25rem',
        margin: '0 auto'
      }}>
        {topThree.map((winner, index) => (
        <Podium
          key={winner.id}
          podium={topThree}
          winner={winner}
          index={index}
        />
      ))}
      </div>
      
      <div className='LeaderBoard' style={{backgroundColor: 'rgb(18, 133, 18)'}}>
        <div className='LeaderboardHeader'>
          <span>Rank</span>
          <span>Name</span>
          <span>Score</span>
        </div>
    
        <div className='LeaderboardList'>
          {leaderboardData.map((entry, index) => (
            <div key={entry.id} className={entry.username === userName ?  'highlighted': 'playerlist'}>
              <span>{index + 1}</span>
              <span>{entry.username}</span>
              <span>{entry.score}</span>
            </div>
          ))}
    
          {/* Display user's entry beneath the top 10 if they are not in the top 10 */}
          {userRank > 10 &&(
            <div className='highlighted'>
              <span>{userRank}</span>
              <span>{userName}</span>
              <span>{userScore}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
