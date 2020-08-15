import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import "../styles/Log.css";
import mail from "../assets/icons/mail.svg";

moment.tz.setDefault("Americas/New_York");

const log = app.firestore().collection("log");

const Log = ({ type }) => {
  const currentTime = moment();
  const prevMonthTime = currentTime.clone().subtract(1, "month");
  const currentMonth = log.doc(currentTime.format("YYYY-MM"));
  const prevMonth = log.doc(prevMonthTime.format("YYYY-MM"));

  currentMonth.get().then((doc) => {
    if (!doc.exists) {
      log.doc(currentTime.format("YYYY-MM")).set({
        month: currentTime.format("M"),
        year: currentTime.format("YYYY"),
      });
    }
  });
  prevMonth.get().then((doc) => {
    if (!doc.exists) {
      log.doc(prevMonthTime.format("YYYY-MM")).set({
        month: prevMonthTime.format("M"),
        year: prevMonthTime.format("YYYY"),
      });
    }
  });

  const [expand, setExpand] = useState(false);
  const [fullLog, setFullLog] = useState([]);

  const [
    currentMonth_snapshot,
    currentMonth_loading,
    currentMonth_error,
  ] = useCollection(currentMonth.collection(type).orderBy("time", "desc"));
  if (currentMonth_error) {
    console.log(JSON.stringify(currentMonth_error));
  }

  const [
    prevMonth_snapshot,
    prevMonth_loading,
    prevMonth_error,
  ] = useCollection(prevMonth.collection(type).orderBy("time", "desc"));
  if (prevMonth_error) {
    console.log(JSON.stringify(prevMonth_error));
  }

  useEffect(() => {
    if (!currentMonth_snapshot && !prevMonth_snapshot) setFullLog([]);
    else if (!currentMonth_snapshot) setFullLog(prevMonth_snapshot.docs);
    else if (!prevMonth_snapshot) setFullLog(currentMonth_snapshot.docs);
    else setFullLog(currentMonth_snapshot.docs.concat(prevMonth_snapshot.docs));
  }, [currentMonth_snapshot, prevMonth_snapshot]);

  const expandedRows = () => (
    <>
      {fullLog.map((doc) => {
        const time = doc.get("time");
        const user = doc.get("user");
        return (
          <tr key={doc.id}>
            <td>{moment(time.toDate()).calendar()}</td>
            <td>
              {user ? <a href={"mailto:" + user}>{user}</a> : "anonymous"}
            </td>
          </tr>
        );
      })}
    </>
  );
  const collapsedRows = () => {
    const collapsedData = {};
    fullLog.forEach((doc) => {
      const user = doc.get("user");
      if (user) {
        if (collapsedData[user]) {
          collapsedData[user]++;
        } else {
          collapsedData[user] = 1;
        }
      }
    });
    const collapsedDataArray = Object.entries(collapsedData);
    collapsedDataArray.sort((a, b) => a[1] - b[1]);
    return (
      <>
        {collapsedDataArray.map((entry) => {
          const count = entry[1];
          const user = entry[0];
          return (
            <tr key={user}>
              <td>{count}</td>
              <td>{user && <a href={"mailto:" + user}>{user}</a>}</td>
            </tr>
          );
        })}
      </>
    );
  };
  const mailtoAll = () => {
    const collapsedData = {};
    fullLog.forEach((doc) => {
      const user = doc.get("user");
      if (user) {
        collapsedData[user] = true;
      }
    });
    const emails = Object.keys(collapsedData);
    return "mailto:" + emails.join(";");
  };

  return (
    <div className="log bg-light">
      <h2>{type && type.charAt(0).toUpperCase() + type.slice(1) + " "}Log</h2>
      <Button
        variant="outline-dark"
        size="sm"
        className="log-button"
        onClick={() => setExpand(!expand)}
      >
        {expand ? "Collapse" : "Expand"}
      </Button>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">{expand ? "Date" : "Frequency"}</th>
            <th scope="col" className="email">
              <a href={mailtoAll()}>
                Email <img src={mail} width="13" alt="Send email" />
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentMonth_error && (
            <tr>
              <td colSpan="2">There was an error loading this month's data.</td>
            </tr>
          )}
          {prevMonth_error && (
            <tr>
              <td colSpan="2">There was an error loading last month's data.</td>
            </tr>
          )}
          {currentMonth_loading && (
            <tr>
              <td colSpan="2">Loading this month's data.</td>
            </tr>
          )}
          {prevMonth_loading && (
            <tr>
              <td colSpan="2">Loading last month's data.</td>
            </tr>
          )}
          {expand ? expandedRows() : collapsedRows()}
        </tbody>
      </table>
    </div>
  );
};

export default Log;
