// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
  isAuthenticated: false,
  user: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // action.payload contains user data
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Export actions
export const { login, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
