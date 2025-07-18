import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      Register Page
      <br />
      <button onClick={() => navigate("/login")}>login</button>
    </div>
  );
};

export default RegisterPage;
