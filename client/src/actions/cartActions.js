import { baseApi } from "../store/api/baseApi";

// Create the cart API slice
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query({
      query: () => "cart/get-cart",
      providesTags: ["Cart"],
    }),

    // Add course to cart
    addToCart: builder.mutation({
      query: (courseId) => ({
        url: "cart/add-cart",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove course from cart
    removeFromCart: builder.mutation({
      query: (courseId) => ({
        url: "cart/remove-cart",
        method: "DELETE",
        body: { courseId },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation({
      query: () => ({
        url: "cart/clear-cart",
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
