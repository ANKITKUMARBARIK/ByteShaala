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
        url: "auth/resend-signup",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "auth/forget-password",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ newPassword, confirmPassword, token }) => ({
        url: `auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword, confirmPassword },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user (optional - for checking auth status)
    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),

    //Add purchase dummy api
    addPurchase: builder.mutation({
      query: (courseId) => ({
        url: "user/add-purchase-course",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Profile", "getCourseById"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useAddPurchaseMutation,
} = authApi;
