import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

function Doorbell() {
  const [rang, setRang] = useState(false);
  const [justRang, setJustRang] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const ring = () => {
    console.log("Doorbell should ring");
    setRang(true);
    setJustRang(true);
    setTimeout(function () {
      if (!mountedRef.current) return null;
      setJustRang(false);
    }, 5000);
  };
  return (
    <Button
      variant={!rang ? "primary" : justRang ? "success" : "warning"}
      onClick={ring}
      disabled={justRang}
    >
      <h2>{justRang ? "Ringing..." : rang ? "Ring Again" : "Ring Doorbell"}</h2>
    </Button>
  );
}

export default Doorbell;
