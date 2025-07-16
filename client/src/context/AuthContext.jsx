import { deleteAllCookies, getCookie, setCookie } from "@utils/commonFunctions";
import { PropTypes } from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const oldRefToken = getCookie("refToken")
  ? JSON.parse(getCookie("refToken"))
  : false;
export const AuthContext = React.createContext({});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ refToken: oldRefToken });

  const token = auth?.token || auth?.refToken;

  const removeAuth = () => {
    dispatch({ type: "logout" });
    deleteAllCookies();
    setAuth(undefined);
    navigate("/sign-in");
  };

  const addAuth = ({ token, refToken }) => {
    setCookie("token", token);
    setCookie("refToken", refToken);
    setAuth({ token, refToken });
  };
  const value = {
    authenticated: token,
    addAuth,
    removeAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
AuthProvider.propTypes = {
  children: PropTypes.element,
};
