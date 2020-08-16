import React from "react";
import "../styles/Nav.css";

const Nav = ({ children }) => {
  return (
    <header>
      <nav className="navbar sticky-top bg-dark">{children}</nav>
    </header>
  );
};

export default Nav;
