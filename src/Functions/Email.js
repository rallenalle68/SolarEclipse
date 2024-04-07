const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getEmailList = functions.https.onRequest(async (req, res) => {
  try {
    // Retrieve all documents from the 'emails' collection
    const snapshot = await admin.firestore().collection('emails').get();

    // Extract emails from each document
    const emails = [];
    snapshot.forEach(doc => {
      const email = doc.data().email;
      if (email) {
        emails.push(email);
      }
    });

    // Format emails as a list
    const emailList = emails.join('\n');

    // Send the email list as a response
    res.status(200).send(emailList);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send('Error fetching emails');
  }
});
