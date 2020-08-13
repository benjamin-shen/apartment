import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

const config = require("../env.json").firebase.config;
const app = firebase.initializeApp(config);

// app.functions().useFunctionsEmulator("http://localhost:5000");

export default app;
