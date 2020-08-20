import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import "moment-timezone";
import linkify from "linkifyjs/html";
import sanitizeHtml from "sanitize-html";
import app from "./base";
import { AuthContext } from "./Auth";
import "../styles/Notes.css";
import plus from "../assets/icons/plus.svg";
import x from "../assets/icons/x.svg";

moment.tz.setDefault("Americas/New_York");

const appCollection = app.firestore().collection("app");

const NoteInput = ({ addNote, setAddingNote }) => {
  const [noteInput, setNoteInput] = useState("");

  const handleChange = (event) => {
    setNoteInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addNote(noteInput);
    setAddingNote(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label className="sr-only" htmlFor="note-input">
          Add Note
        </label>
        <input
          type="text"
          className="form-control"
          id="note-input"
          placeholder="Your Note"
          onChange={handleChange}
        />
        <span className="input-group-btn">
          <Button type="submit" className="add-note-btn">
            Add
          </Button>
        </span>
      </div>
    </form>
  );
};

const Notes = ({ type, document }) => {
  const collection = appCollection.doc(document).collection("notes");

  const { guestUser } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [message, setMessage] = useState("");

  const [snapshot, loading, error] = useCollection(collection.orderBy("time"));
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
            {editing && !guestUser && (
              <img
                src={x}
                width="22"
                alt="Delete note."
                className="float-right delete-note"
                onClick={() => deleteNote(doc.id)}
              />
            )}
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(linkify(value), {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    "img",
                  ]),
                }),
              }}
            ></div>
          </td>
        </tr>
      );
    });
    return result.length && <>{result}</>;
  };

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const addNote = (note) => {
    if (note) {
      collection
        .add({
          time: new Date(),
          value: note,
        })
        .then(() => {
          setMessage("");
        })
        .catch((err) => {
          setMessage("Error!");
          setTimeout(() => {
            if (!mountedRef.current) return null;
            setMessage(err.message);
          }, 500);
        });
    } else {
      setMessage("The note was empty!");
      setTimeout(() => {
        if (!mountedRef.current) return null;
        setMessage("");
      }, 1000);
    }
  };
  const deleteNote = (id) => {
    collection
      .doc(id)
      .delete()
      .catch((err) => {
        setMessage("Error!");
        setTimeout(() => {
          if (!mountedRef.current) return null;
          setMessage(err.message);
        }, 500);
      });
  };

  return (
    <div className="notes bg-light">
      <h2>{type && type.charAt(0).toUpperCase() + type.slice(1) + " "}Notes</h2>
      {!guestUser && (
        <Button
          variant={editing ? "dark" : "outline-dark"}
          size="sm"
          className="notes-button"
          onClick={() => {
            setEditing(!editing);
            setAddingNote(false);
          }}
        >
          {editing ? "Done" : "Edit"}
        </Button>
      )}
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
          {editing && !guestUser && (
            <tr>
              {addingNote ? (
                <td>
                  <NoteInput addNote={addNote} setAddingNote={setAddingNote} />
                </td>
              ) : (
                <td
                  className="add-note text-center"
                  onClick={() => {
                    setAddingNote(true);
                  }}
                >
                  <img src={plus} width="22" alt="Add note." />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
      {message && <p className="text-danger">{message}</p>}
    </div>
  );
};

export default Notes;
