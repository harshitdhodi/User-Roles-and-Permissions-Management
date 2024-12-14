import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './App.css'

import { useGetUserRefetchQuery } from './store/api/apiSlice'
import { clearAllDetails, setToken } from './store/reducer/authSlice'
import { createAppRouter } from './router/AppRouter'

export default function App() {
  const dispatch = useDispatch();
  const { data: userData, isLoading, error } = useGetUserRefetchQuery();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(clearAllDetails());
    } else if (userData) {
      dispatch(setToken(userData));
    }
  }, [userData, error, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a proper loading component here
  }

  const router = createAppRouter(isAuthenticated);

  return <RouterProvider router={router} />
}

