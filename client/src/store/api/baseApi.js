import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API configuration with auth token interceptor
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com", // Replace with your actual API base URL
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = getState().auth.token;

      // If we have a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  // No endpoints defined yet, they will be injected from other files
} = baseApi;
