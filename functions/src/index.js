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

exports.ringDoorbell = functions.https.onCall((data, { auth }) => {
  return doorbell
    .ring(
      auth && auth.token.name,
      auth && auth.token.email,
      moment().tz("America/New_York")
    )
    .catch((err) => {
      console.log(err);
    });
});

exports.validate = functions.https.onCall((password) => {
  return password === guestPassword;
});
