import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from '../Assets/firebase-config';
import { collection, query, orderBy, getDocs, doc, getDoc, limit } from 'firebase/firestore';

function Leaderboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
  
    fetchData();
  }, [user]);
  
  useEffect(() => {
    if (userName !== "") {
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
      console.error('Error fetching leaderboard data:', error);
    }
  };
  
  
  

  return (
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
  );
  
}

export default Leaderboard;
