import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    // Create user
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users']
    }),

    // Get all users with query params
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          isActive: params?.isActive,
        },
      }),
      providesTags: ['Users']
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),

    // Update user (full update)
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'Users'
      ]
    }),

    // Partial update user
    partialUpdateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'Users'
      ]
    }),

    // Soft delete/deactivate user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        'Users'
      ]
    }),

    // Upload profile image
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/update-profile-image',
        method: 'PATCH',
        body: formData,
        formData: true, // Important for file uploads
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'Users'
      ]
    }),

    // Update user role
    updateUserRole: builder.mutation({
      query: ({ userId, roleId }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { roleId }
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'Users'
      ]
    }),
    // Update user status
    updateUserStatus: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        'Users'
      ]
    })
  }),
});

// Export hooks for usage in components
export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  usePartialUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useUploadProfileImageMutation,
  useUpdateUserRoleMutation,
 
} = userApi;