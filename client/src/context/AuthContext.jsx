import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { deleteAllCookies, getCookie, setCookie } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";

// Get initial tokens from cookies (they're now stored as strings, not JSON)
const oldRefToken = getCookie("refToken") || null;
const oldAccessToken = getCookie("token") || null;
const oldUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize auth state with tokens and user from cookies
  const [auth, setAuth] = useState({
    token: oldAccessToken,
    refToken: oldRefToken,
    user: oldUser,
  });

  const token = auth?.token || auth?.refToken;

  const removeAuth = () => {
    dispatch(logout());
    deleteAllCookies();
    // setAuth({ token: null, refToken: null, user: null });
    navigate("/login");
  };

  const addAuth = ({ token, refToken, user }) => {
    // Store tokens in cookies
    if (token) setCookie("token", token);
    if (refToken) setCookie("refToken", refToken);
    if (user) setCookie("user", JSON.stringify(user));

    // Update auth state
    setAuth({ token, refToken, user });
  };

  const value = {
    authenticated: token,
    user: auth?.user,
    isAdmin: auth?.user?.role === "ADMIN",
    addAuth,
    removeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
