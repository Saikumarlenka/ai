// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../redux/chat/chatSlice'
import authReducer from '../redux/auth/authSlice'

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth:authReducer
  },
});

export default store;
