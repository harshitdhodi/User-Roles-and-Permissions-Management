import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import Cookies from 'js-cookie';

export const setSecureCookie = (key, value, options = {}) => {
  Cookies.set(key, value, { ...options, secure: true, sameSite: 'strict' });
};
// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/sessions/login', credentials);
      // Set the token in the cookie using the utility function
      setSecureCookie('token', response.data.token, { expires: 7 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/api/v1/sessions/logout');
      Cookies.remove('token'); // Remove the token from the cookie
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null, // Retrieve the token from cookies
    user: null,
    isAuthenticated: !!Cookies.get('token'),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAllDetails: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    // Additional reducer to set the token directly if needed
    setToken: (state, action) => {
      const { user } = action.payload;
    
      state.user = user;
    },
    updateUserImage: (state, action) => {
      if (state.user) {
     
        state.user.img = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      });
      
  },
});

export const { clearError, clearAllDetails, setToken ,updateUserImage} = authSlice.actions;
export default authSlice.reducer;
