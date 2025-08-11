/* eslint-disable no-empty-pattern */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Mutex } from "../../utils/mutex";
import { refreshTokenSuccess, logout } from "../slices/authSlice";

import { getCookie } from "@/lib/utils";

// Create mutex instance to prevent concurrent refresh calls
const mutex = new Mutex();

const refreshToken = getCookie("refToken");

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8888/api/v1", // Replace with your actual API base URL
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
    const token = getState().auth.token || getCookie("token");
    // If we have a token, add it to the headers
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // Check if the error indicates token expiration
  const isTokenExpired = result?.error?.status === 401;

  if (isTokenExpired) {
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await handleTokenRefresh(api, extraOptions);
      if (refreshResult.success) {
        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch(logout());
        // Redirect to login page
        window.location.href = "/login";
      }
    } else {
      // No refresh token available, logout user
      api.dispatch(logout());
      // Redirect to login page
      window.location.href = "/login";
    }
  }

  return result;
};

// Handle token refresh with mutex to prevent concurrent calls
const handleTokenRefresh = async (api, extraOptions) => {
  if (!mutex.isLocked) {
    // Acquire mutex lock
    const unlock = await mutex.acquire();

    try {
      const state = api.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        return { success: false };
      }

      // Make refresh token API call
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data?.success) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data.data;

        // Update tokens in Redux store and localStorage
        api.dispatch(
          refreshTokenSuccess({
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    } finally {
      unlock();
    }
  } else {
    // Wait for ongoing refresh to complete
    await mutex.waitForUnlock();

    // Check if token was refreshed successfully
    const state = api.getState();
    const hasValidToken = state.auth.token && state.auth.isAuthenticated;

    return { success: hasValidToken };
  }
};

// Base API configuration with auth token interceptor and refresh mechanism
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  // No endpoints defined yet, they will be injected from other files
} = baseApi;
