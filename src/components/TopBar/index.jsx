import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./styles.css";
import axios from "axios";
import Button from "react-bootstrap/Button";

function TopBar() {
  const [appContext, setAppContext] = useState(""); // State to hold app context
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const namePath = location.pathname.slice(0, 7);
        const id = location.pathname.slice(7);
        const response = await axios.get(`http://localhost:8081/api/user/${id}`);
        const user = response.data;
        const fullname = ` ${user.last_name}`;
        if (location.pathname === "/") {
          setAppContext("Home");
        } else if (location.pathname.includes("/users/")) {
          setAppContext(`Information of User ${fullname}`);
        } else if (namePath === "/photos") {
          setAppContext(`Photos of User ${fullname}`);
        } else {
          setAppContext("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.success) {
          setUserName(response.data.username);
          console.log("Username fetched:", response.data.username); // Added console.log
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" color="inherit" className="app-context">
          {appContext ? `${appContext}` : "Home"}
        </Typography>
        {userName && (
          <Typography variant="h6" color="inherit" className="app-context">
            Hi, {userName}
          </Typography>
        )}
        <Button
          onClick={handleLogout}
          variant="light"
          className="logout-button"
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
