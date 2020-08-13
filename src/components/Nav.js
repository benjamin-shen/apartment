import React from "react";
import "../styles/Nav.css";

function Nav({ children }) {
  return (
    <header>
      <nav className="navbar sticky-top bg-light">{children}</nav>
    </header>
  );
}

export default Nav;
