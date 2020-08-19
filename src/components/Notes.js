import React, { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import "../styles/Notes.css";
import plus from "../assets/icons/plus.svg";

moment.tz.setDefault("Americas/New_York");

const appCollection = app.firestore().collection("app");

const Notes = ({ type, document }) => {
  const [notes, setNotes] = useState([]);

  const [snapshot, loading, error] = useCollection(
    appCollection.doc(document).collection("notes").orderBy("priority", "desc")
  );
  if (error) {
    console.log(JSON.stringify(error));
  }

  useEffect(() => {
    if (snapshot) {
      setNotes(snapshot.docs);
    } else {
      setNotes([]);
    }
  }, [snapshot]);

  const rows = () => {
    const result = notes.map((doc) => {
      const time = doc.get("time");
      const value = doc.get("value");
      const momentTime = moment(time.toDate());
      return (
        <tr key={doc.id}>
          <td title={momentTime && "Created " + momentTime.format("llll")}>
            {value}
          </td>
        </tr>
      );
    });
    return (
      result.length && (
        <>
          {result}
          <tr>
            <td className="add-note text-center">
              <img src={plus} width="25" alt="Add note." />
            </td>
          </tr>
        </>
      )
    );
  };

  return (
    <div className="notes bg-light">
      <h2>{type && type.charAt(0).toUpperCase() + type.slice(1) + " "}Notes</h2>
      <table className="table">
        <tbody>
          {error && (
            <tr>
              <td colSpan="1">
                There was an error loading the {type.toLowerCase() + " "}notes.
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan="1">Loading the {type.toLowerCase() + " "}notes.</td>
            </tr>
          )}
          {rows() ||
            (!(error || loading) && (
              <tr>
                <td colSpan="1">
                  There are no {type.toLowerCase() + " "}notes.
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notes;
