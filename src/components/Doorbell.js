import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import useSound from "use-sound";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import { AuthContext } from "./Auth";
import dingdong from "../assets/sounds/dingdong.mp3";

moment.tz.setDefault("Americas/New_York");
const isValidDate = (str) => {
  var d = moment(str);
  if (d == null || !d.isValid()) return false;
  return str.indexOf(d.format() >= 0);
};

const appName = require("../env.json").app.name;
const lastInvokedKey = `${appName}-lastInvokedDoorbell`;
const lastInvokedThrottle = 60000;

const log = app.firestore().collection("log");
const ringDoorbell = app.functions().httpsCallable("ringDoorbell");
const logDoorbell = app.functions().httpsCallable("logDoorbell");

function Doorbell() {
  const [playSound] = useSound(dingdong);
  const [rang, setRang] = useState(false);
  const [justRang, setJustRang] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [lastInvoked] = useLocalStorage(lastInvokedKey);

  const { currentUser } = useContext(AuthContext);

  const ring = () => {
    console.log("Rang doorbell.");
    const time = moment();
    const month = time.format("YYYY-MM");

    try {
      if (lastInvoked && !isValidDate(lastInvoked)) {
        console.log("Local storage corrupted.");
        console.log(lastInvokedKey + ": " + lastInvoked);
        writeStorage(lastInvokedKey, time.format());
      }
      if (
        !lastInvoked ||
        time.diff(moment(lastInvoked)) >= lastInvokedThrottle
      ) {
        writeStorage(lastInvokedKey, time.format());

        ringDoorbell()
          .then(() => {
            console.log("Notified residents.");
          })
          .catch((err) => {
            console.log("Couldn't notify residents.");
            console.log(err);
          });

        if (currentUser && currentUser.emailVerified) {
          log
            .doc(month)
            .collection("doorbell")
            .add({ user: currentUser.email, time: new Date(time) })
            .then(() => {
              console.log("Logged doorbell.");
            })
            .catch((err) => {
              console.log("Couldn't log doorbell.");
              console.log(err);
            });
        } else {
          logDoorbell(month)
            .then(() => {
              if (currentUser) {
                console.log("Logged unverified doorbell.");
              } else {
                console.log("Logged anonymous doorbell.");
              }
            })
            .catch((err) => {
              console.log("Couldn't log doorbell.");
              console.log(err);
            });
        }
      }
    } catch (err) {
      console.log("Local storage error.");
      console.log(err);
      writeStorage(lastInvokedKey, time.format());
    }

    setRang(true);
    setJustRang(true);
    setTimeout(function () {
      if (!mountedRef.current) return null;
      setJustRang(false);
    }, 5000);
  };

  const pressDoorbell = () => {
    ring();
    playSound();
  };

  return (
    <Button
      variant={!rang ? "primary" : justRang ? "success" : "warning"}
      onClick={pressDoorbell}
      disabled={justRang}
    >
      <h2>{justRang ? "Ringing..." : rang ? "Ring Again" : "Ring Doorbell"}</h2>
    </Button>
  );
}

export default Doorbell;
