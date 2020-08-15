//const express = require("express");
//const router = express.Router();
const moment = require("moment");
require("moment-timezone");

const env = require("../env.json");

const serviceAccount = env.firebase.credentials;
const databaseURL = env.firebase.databaseUrl;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const doorbell = require("./doorbell.js");
const guestPassword = env.app.guestPassword;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

exports.validate = functions.https.onCall((password) => {
  return password === guestPassword;
});

exports.ringDoorbell = functions.https.onCall((_, { auth }) => {
  return doorbell
    .ring(
      auth && auth.token.name,
      auth && auth.token.email,
      auth && auth.token.email_verified,
      moment().tz("America/New_York")
    )
    .catch((err) => {
      console.log(err);
    });
});

exports.logDoorbell = functions.https.onCall((month) => {
  return admin
    .firestore()
    .collection("log")
    .doc(month)
    .collection("doorbell")
    .add({ time: new Date() })
    .catch((err) => {
      console.log(err);
    });
});
