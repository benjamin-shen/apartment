import * as firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyCNFRjXlTMplLw40x7Ie_nZK6ZveDcS294",
  authDomain: "apt-401b.firebaseapp.com",
  databaseURL: "https://apt-401b.firebaseio.com",
  projectId: "apt-401b",
  storageBucket: "apt-401b.appspot.com",
  messagingSenderId: "447529680749",
  appId: "1:447529680749:web:08a0a5bdb8bfed59d26464",
  measurementId: "G-K22Z36FX70",
};
const app = firebase.initializeApp(config);

export default app;