// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authSlice'
import userDetailsReducer from './reducer/userDetailsSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDetails: userDetailsReducer,
    [apiSlice.reducerPath]:apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Disable serializable check for complex objects
    }).concat(apiSlice.middleware),
});