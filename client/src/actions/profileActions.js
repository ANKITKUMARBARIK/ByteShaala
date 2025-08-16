import { baseApi } from "../store/api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getUserProfile: builder.query({
      query: () => "user/current-user",
      providesTags: ["Profile"],
    }),

    // Update user account details (with avatar upload support)
    updateAccount: builder.mutation({
      query: (formData) => ({
        url: "user/update-account",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "user/change-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    // Delete user account
    deleteUser: builder.mutation({
      query: () => ({
        url: "user/delete-user",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateAccountMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = profileApi;
