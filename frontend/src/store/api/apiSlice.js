import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // A unique key for the store
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1', // Your API's base URL
        prepareHeaders: (headers, { getState }) => {
            // Add token to headers if available
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Define API endpoints here
        getUserDetails: builder.query({
            query: (userId) => `/users/${userId}`, // API path
        }),
        getUserRefetch: builder.query({
            query: () => `/sessions/refetch`, // API path
        }),
        updateUserProfile: builder.mutation({
            query: ({ userId, userData }) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: userData,
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: `/sessions/login`,
                method: 'POST',
                body: credentials,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `/sessions/logout`,
                method: 'POST',
            }),
        }),
        updateProfileImage: builder.mutation({
            query: (formData) => ({
              url: 'update-profile-image',
              method: 'PATCH',
              body: formData,
              // No need to specify content-type, RTK Query handles multipart/form-data
            }),
            invalidatesTags: ['User']
          }),
    }),
});

// Export hooks generated for the endpoints
export const {
    useGetUserDetailsQuery,
    useGetUserRefetchQuery,
    useUpdateUserProfileMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useUpdateProfileImageMutation
} = apiSlice;
