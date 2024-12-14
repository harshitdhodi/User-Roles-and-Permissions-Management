// src/store/userDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: {
    profile: null,
    sessions: [],
    activityLogs: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearUserDetailsError: (state) => {
      state.error = null;
    },
   
  },
  extraReducers: (builder) => {
    // Fetch user details cases
    builder.addCase(fetchUserDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        isActive: action.payload.isActive,
        role: action.payload.role,
        img:action.payload.img
      };
      state.sessions = action.payload.sessions || [];
      state.activityLogs = action.payload.activityLogs || [];
    })
    .addCase(fetchUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user details';
      state.profile = null;
      state.sessions = [];
      state.activityLogs = [];
    })
    // Update user profile cases
    .addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = {
        ...state.profile,
        ...action.payload
      };
    })
    .addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update profile';
    });
  }
});

export const { clearUserDetailsError} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;