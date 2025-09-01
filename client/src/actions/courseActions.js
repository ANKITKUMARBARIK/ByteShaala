import { baseApi } from "../store/api/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all courses with optional filters
    getCourses: builder.query({
      query: (filters = {}) => {
        let queryString = "course/get-all-courses";
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
      providesTags: ["getCourses"],
    }),

    // Get a single course by ID
    getCourseById: builder.query({
      query: (id) => `course/get-course/${id}`,
      providesTags: ["getCourseById"],
    }),

    // Create a new course (admin only)
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "course/create-course",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["getCourses"],
    }),

    // Update an existing course (admin only)
    updateCourse: builder.mutation({
      query: ({ id, ...courseData }) => ({
        url: `course/update-course/${id}`,
        method: "PUT",
        body: courseData,
      }),
      invalidatesTags: ["getCourses", "getCourseById"],
    }),

    // Delete a course (admin only)
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `course/delete-course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["getCourses", "getCourseById"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
