// /utils/firebaseAdmin.js

const admin = require('firebase-admin');
const firebaseConfig = require('../config/firbaseConfig');
const serviceAccount = require('../config/serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "library-6aa73.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = {
  bucket
};
