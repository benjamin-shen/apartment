//const express = require("express");
//const router = express.Router();

const serviceAccount = require("../env.json").firebase.credentials;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const email = require("./email.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apt-401b.firebaseio.com",
});

exports.ringDoorbell = functions.https.onCall(() => {
  email.send();
  return "Doorbell rang.";
});
