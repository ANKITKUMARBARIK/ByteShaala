import { baseApi } from "../store/api/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all courses with optional filters
    getCourses: builder.query({
      query: (filters = {}) => {
        let queryString = "courses";
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.priceMin !== undefined)
          params.append("priceMin", filters.priceMin);
        if (filters.priceMax !== undefined)
          params.append("priceMax", filters.priceMax);

        const paramsString = params.toString();
        if (paramsString) {
          queryString += `?${paramsString}`;
        }

        return queryString;
      },
      providesTags: ["Courses"],
    }),

    // Get a single course by ID
    getCourseById: builder.query({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    // Create a new course (admin only)
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Update an existing course (admin only)
    updateCourse: builder.mutation({
      query: ({ id, ...courseData }) => ({
        url: `courses/${id}`,
        method: "PUT",
        body: courseData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Courses", id },
        "Courses",
      ],
    }),

    // Delete a course (admin only)
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Change course status (draft/active) (admin only)
    changeCourseStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `courses/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Courses", id },
        "Courses",
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useChangeCourseStatusMutation,
} = courseApi;
