import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Button.css";

const View = ({ text, link }) => {
  return (
    <Link to={link}>
      <Button variant="outline-info" className="view float-center">
        {text || "View"}
      </Button>
    </Link>
  );
};

export default View;
