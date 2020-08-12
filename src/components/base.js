import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

const config = require("../env.json").firebase.config;
const app = firebase.initializeApp(config);

export default app;
