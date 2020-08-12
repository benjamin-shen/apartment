import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import useSound from "use-sound";
import { AuthContext } from "./Auth";
import app from "./base";
import dingdong from "../assets/sounds/dingdong.mp3";

// app.functions().useFunctionsEmulator("http://localhost:5000");
const ringDoorbell = app.functions().httpsCallable("ringDoorbell");

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
    // TODO add checks to avoid spam
    const userEmail = currentUser && currentUser.email;
    ringDoorbell(userEmail).then((res) => {
      console.log(res.data);
    });

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
