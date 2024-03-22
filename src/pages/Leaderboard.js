import React, { useEffect, useState } from 'react';
import './App.css';
import { db } from '../Assets/firebase-config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../Assets/firebase-config';

function Leaderboard({ user }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (userName !== "") {
      fetchLeaderboardData(userName);
    }
  }, [userName]);

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
          <div key={entry.id} className={entry.username === userName ? 'highlighted' : 'playerlist'}>
            <span>{index + 1}</span>
            <span>{entry.username}</span>
            <span>{entry.score}</span>
          </div>
        ))}

        {/* Display user's entry beneath the top 10 if they are not in the top 10 */}
        {userRank && userRank > 10 && (
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
