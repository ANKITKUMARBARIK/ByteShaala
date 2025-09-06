import { baseApi } from "../store/api/baseApi";

// Admin API endpoints
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (filters = {}) => {
        let queryString = "user/all-users";
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        if (filters.page) params.append("page", filters.page);
        if (filters.limit) params.append("limit", filters.limit);

        const paramsString = params.toString();
        if (paramsString) {
          queryString += `?${paramsString}`;
        }

        return queryString;
      },
      providesTags: ["getAllUsers"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getAllUsers"],
    }),

    // Course Management Endpoints
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/course/create-course",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["getCourses"],
    }),

    updateCourse: builder.mutation({
      query: ({ slug, courseData }) => ({
        url: `/course/update-course/${slug}`,
        method: "PUT",
        body: courseData,
      }),
      invalidatesTags: ["getCourses", "getCourseById"],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/course/delete-course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getCourses"],
    }),
  }),
});

// Export hooks for use in components
export const {
  // User Management Hooks
  useDeleteUserMutation,
  // Course Management Hooks
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetAllUsersQuery,
} = adminApi;

export default adminApi;
