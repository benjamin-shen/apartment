const express = require("express");

const serviceAccount = require("./env.json").firebase.credentials;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

//const router = express.Router();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apt-401b.firebaseio.com",
});

exports.ringDoorbell = functions.https.onCall(() => {
  return "Doorbell rang.";
});
