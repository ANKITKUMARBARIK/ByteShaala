import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the cart API slice
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8888/api/v1/cart",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query({
      query: () => "",
      providesTags: ["Cart"],
    }),

    // Add course to cart
    addToCart: builder.mutation({
      query: (courseId) => ({
        url: "",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove course from cart
    removeFromCart: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation({
      query: () => ({
        url: "/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
