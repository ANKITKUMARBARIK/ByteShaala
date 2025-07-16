import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    priceRange: { min: 0, max: 1000 },
    sortBy: "popularity", // popularity, price-low-high, price-high-low, newest
  },
};

export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setLoading,
  setError,
  setCourses,
  setSelectedCourse,
  updateFilters,
  resetFilters,
} = courseSlice.actions;

export default courseSlice.reducer;
