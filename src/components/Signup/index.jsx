import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./styles.css"; // Import CSS

function Signup() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường không được để trống
    if (!username || !password) {
      setError("Username và Password không được để trống.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/user/createUser",
        {
          first_name,
          last_name,
          location,
          description,
          occupation,
          username,
          password,
        },
      );

      if (response.status === 200) {
        // Đăng ký thành công, chuyển hướng đến trang đăng nhập
        navigate("/");
      }
    } catch (err) {
      // Xử lý lỗi nếu có
      setError(
        err.response?.data?.message || "An error occurred during signup.",
      );
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-form-content">
          <h3 className="auth-form-title">Signup</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="d-grid gap-2 mt-3">
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
          <p className="register-link text-right mt-2">
            <a href="/">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
