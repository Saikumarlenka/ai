// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
});

export default store;
