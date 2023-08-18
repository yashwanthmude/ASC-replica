import React, { useState } from "react";
import axios from "axios";
//import login.css
import "./login.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      }, { withCredentials: true });
      if (response.status === 200) {
        // Redirect to the home page or another protected page
        window.location.href = "/home";
      }
    } catch (e) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="number"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
