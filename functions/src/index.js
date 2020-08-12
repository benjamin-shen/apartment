//const express = require("express");
//const router = express.Router();
const moment = require("moment");
require("moment-timezone");

const env = require("../env.json");

const serviceAccount = env.firebase.credentials;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const email = require("./email.js");
const emailCredentials = env.gmail.auth;
const guestPassword = env.app.guestPassword;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apt-401b.firebaseio.com",
});

exports.ringDoorbell = functions.https.onCall((userEmail) => {
  email.send(
    emailCredentials,
    userEmail,
    moment().tz("America/New_York").format("MMMM Do YYYY, h:mma")
  );
  return "Doorbell rang.";
});

exports.validate = functions.https.onCall((password) => {
  return password === guestPassword;
});
