import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/Button.css";

const Show = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {show ? children :<Button
        variant="outline-success"
        className="show"
        onClick={() => {
          setShow(true);
        }}
      >
        {text || "Show"}
      </Button>}
    </div>
  );
};

export default Show;
