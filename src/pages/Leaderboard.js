import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from '../Assets/firebase-config';
import { collection, query, orderBy, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import Podium from '../Component/Podium'


function Leaderboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(null);
  const [round, setRound] = useState(1);
  const [topThree, setTopThree] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
  
    fetchData();
  }, [user]);
  
  useEffect(() => {
    if (userName !== "") {
      console.log(userName)
      fetchLeaderboardData(userName);
    }
  }, [userName]);

  const fetchUserData = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userId = user.uid;
      const userDocRef = doc(usersCollection, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("userdata is retrieved like this: ", userData)
        if (userData) {

          setUserName(userData.username);
        }
        if(userName !== ""){
          fetchLeaderboardData(userName)

        }
      }


    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
    }

  };

  const fetchLeaderboardData = async (userName) => {
    try {
      const leaderboardCollection = collection(db, 'leaderboard');
      const leaderboardQuery = query(leaderboardCollection, orderBy('score', 'desc'));
  
      const querySnapshot = await getDocs(leaderboardQuery);
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
        console.log("UserData: ",userData)
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
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const handleClickRound = (round) => {
    const style = "backgroundColor: orange";
    setRound(round);
    document.getElementById('round1').style.backgroundColor = '';
    document.getElementById('round2').style.backgroundColor = '';
    document.getElementById('round3').style.backgroundColor = '';
    document.getElementById(`round${round}`).style.backgroundColor = 'orange';
  };
  
  const handleHover = (round) => {
    const button = document.getElementById(`round${round}`);
    button.style.fontSize = '1.5em';
  };

  const handleHoverOut = (round) => {
    const button = document.getElementById(`round${round}`);
    button.style.fontSize = '1em';
  };

  return (
    <>
      <div style={{paddingTop: '10px'}}>
        <button id='round1' onClick={() => handleClickRound(1)} onMouseOver={() => handleHover(1)} onMouseOut={() => handleHoverOut(1)}>Round 1</button>
        <button id='round2' onClick={() => handleClickRound(2)} onMouseOver={() => handleHover(2)} onMouseOut={() => handleHoverOut(2)}>Round 2</button>
        <button id='round3' onClick={() => handleClickRound(3)} onMouseOver={() => handleHover(3)} onMouseOut={() => handleHoverOut(3)}>Round 3</button>
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
        borderBottom: '2px solid black',
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
      
      <div className='LeaderBoard'>
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