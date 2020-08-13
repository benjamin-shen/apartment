//const express = require("express");
//const router = express.Router();
const moment = require("moment");
require("moment-timezone");

const env = require("../env.json");

const serviceAccount = env.firebase.credentials;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const doorbell = require("./doorbell.js");
const guestPassword = env.app.guestPassword;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apt-401b.firebaseio.com",
});

exports.ringDoorbell = functions.https.onCall((data, { auth }) => {
  doorbell.ring(
    auth.token.name,
    auth.token.email,
    moment().tz("America/New_York")
  );
});

exports.validate = functions.https.onCall(({ password }) => {
  return password === guestPassword;
});
