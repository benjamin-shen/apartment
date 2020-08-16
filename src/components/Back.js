import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Back.css";

const Back = () => {
  return (
    <Link to="/">
      <Button variant="outline-light" className="back float-left">
        Back
      </Button>
    </Link>
  );
};

export default Back;
