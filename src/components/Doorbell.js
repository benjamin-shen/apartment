import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import useSound from "use-sound";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import { AuthContext } from "./Auth";
import dingdong from "../assets/sounds/dingdong.mp3";

moment.tz.setDefault("Americas/New_York");

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

  const { currentUser } = useContext(AuthContext);

  const ring = () => {
    const time = moment();
    const month = time.format("YYYY-MM");

    // TODO add checks to avoid spam
    ringDoorbell()
      .then(() => {
        console.log("Rang doorbell.");
      })
      .catch((err) => {
        console.log("Couldn't ring doorbell.");
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
