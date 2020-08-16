import React, { useState } from "react";
import app from "./base";
import "../styles/Wifi.css";

const appCollection = app.firestore().collection("app");
const info = appCollection.doc("info");

const Wifi = () => {
  const [ssid, setSSID] = useState();
  const [passcode, setPasscode] = useState();

  try {
    info.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setSSID(data.wifiSSID);
        setPasscode(data.wifiPasscode);
      }
    });
  } catch (err) {
    console.log(err);
  }

  return ssid ? (
    <div className="wifi bg-light">
      <h2>Wifi</h2>
      <div className="wifi-info">
        <div>
          <h3>Name: {ssid}</h3>
          {passcode && (
            <h3>
              Password: <em>{passcode}</em>
            </h3>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Wifi;
