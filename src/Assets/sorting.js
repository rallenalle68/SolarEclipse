const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getLeaderboard = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.database().ref('users').orderByChild('score').limitToLast(10).once('value');
    const leaderboard = snapshot.val();
    response.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    response.status(500).send('Internal Server Error');
  }
});
