import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Button.css";

const ProfileButton = ({ link }) => {
  return (
    <Link to={link || "/profile"}>
      <Button variant="info" className="profile-btn float-right">
        Profile
      </Button>
    </Link>
  );
};

export default ProfileButton;
