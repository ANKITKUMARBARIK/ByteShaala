import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      Login Page
      <br />
      <button onClick={() => navigate("/register")}>register</button>
    </div>
  );
};

export default LoginPage;
