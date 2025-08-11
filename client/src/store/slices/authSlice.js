import { createSlice } from "@reduxjs/toolkit";

import { deleteAllCookies, getCookie, setCookie } from "@/lib/utils";

const initialState = {
  user: null,
  token: getCookie("token") || null,
  refreshToken: getCookie("refToken") || null,
  isAuthenticated: !!getCookie("token"),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      setCookie("token", action.payload.token);
      setCookie("refToken", action.payload.refreshToken);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      setCookie("token", action.payload.token);
      setCookie("refToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      deleteAllCookies();
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  refreshTokenSuccess,
  logout,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
