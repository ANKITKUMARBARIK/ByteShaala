import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { deleteAllCookies, getCookie, setCookie } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";

// Get initial tokens from cookies (they're now stored as strings, not JSON)
const oldRefToken = getCookie("refToken") || null;
const oldAccessToken = getCookie("token") || null;

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize auth state with tokens from cookies
  const [auth, setAuth] = useState({
    token: oldAccessToken,
    refToken: oldRefToken,
  });

  const token = auth?.token || auth?.refToken;

  const removeAuth = () => {
    dispatch(logout());
    deleteAllCookies();
    // setAuth({ token: null, refToken: null });
    navigate("/login");
  };

  const addAuth = ({ token, refToken }) => {
    // Store tokens in cookies
    if (token) setCookie("token", token);
    if (refToken) setCookie("refToken", refToken);

    // Update auth state
    setAuth({ token, refToken });
  };

  const value = {
    authenticated: token,
    addAuth,
    removeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
