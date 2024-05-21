import React, { useState } from "react";
import "./styles.css";
import axios from "axios"; // Dùng để gửi yêu cầu HTTP
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Login() {
  const [username, setusername] = useState(""); // Theo dõi trạng thái của username
  const [password, setPassword] = useState(""); // Theo dõi trạng thái của mật khẩu
  const [error, setError] = useState(""); // Theo dõi lỗi
  const navigate = useNavigate(); // Để chuyển hướng khi cần thiết

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setError("Vui lòng nhập username và password");
    } else {
      try {
        const response = await axios.post("http://localhost:8081/api/login", {
          username,
          password,
        });
        if (response.data.success) {
          localStorage.setItem("authToken", response.data.token);
          window.location.reload();
        }
      } catch (err) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-content">
          <h3 className="auth-form-title">Login</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setusername(e.target.value)}
              type="text"
              className="form-control mt-1"
              placeholder="Enter username"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <Button onClick={handleLogin} variant="primary">
              Submit
            </Button>
          </div>
          <div className="text-right mt-2">
            <p className="forgot-password">
              Forgot <a href="#">password?</a>
            </p>
            <p className="register-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
