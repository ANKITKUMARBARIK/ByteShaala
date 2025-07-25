import { baseApi } from "../store/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User registration
    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // User login
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify OTP
    verifyOtp: builder.mutation({
      query: ({ otpSignup }) => ({
        url: "auth/verify-signup",
        method: "POST",
        body: { otpSignup },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user (optional - for checking auth status)
    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetCurrentUserQuery,
} = authApi;
