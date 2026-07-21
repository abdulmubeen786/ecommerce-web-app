import React from "react";
import TopBar from "../Layout/TopBar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div>
      {/* top bar */}
      <TopBar />
      {/* Navbar */}
      <Navbar />
      {/* Cart Bar */}
    </div>
  );
};

export default Header;
