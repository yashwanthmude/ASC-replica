import React from "react";
import { Link } from "react-router-dom";
import "./nav.css";
import axios from "axios";

const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.get("http://localhost:5000/home/logout", {
      withCredentials: true,
    });
    if (response.status === 200) {
      
      window.location.href = "/login";
    }
  } catch (e) {
    if (e.response.status === 401) {
      window.location.href = "/login";
    }
  }
};



const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/course/running" className="nav-link">Running</Link>
        </li>
        <li className="nav-item">
          <Link to="/home/registration" className="nav-link">Registration</Link>
        </li>
        <li className="nav-item">

          <button type="submit" onClick={handleSubmit}>
            LOGOUT
          </button>

        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
