import { baseApi } from "../store/api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query({
      query: () => "profile",
      providesTags: ["Profile"],
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "profile/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),

    // Get user's purchased courses
    getPurchasedCourses: builder.query({
      query: () => "profile/courses",
      providesTags: ["PurchasedCourses"],
    }),

    // Upload profile avatar
    uploadAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: "profile/avatar",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetPurchasedCoursesQuery,
  useUploadAvatarMutation,
} = profileApi;
