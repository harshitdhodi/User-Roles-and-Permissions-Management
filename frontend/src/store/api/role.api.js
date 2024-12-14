
import { apiSlice } from './apiSlice';

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRolesData: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/roles/prisma`,
        params: { page, limit }
      }),
      providesTags: ['Role']
    }),

    // Get single role by ID
    getRoleById: builder.query({
      query: (id) => `/roles/prisma/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }]
    }),

    // Create new role
    createRole: builder.mutation({
      query: (roleData) => ({
        url: '/roles/prisma',
        method: 'POST',
        body: roleData
      }),
      invalidatesTags: ['Role']
    }),

    // Update role
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/roles/prisma/${id}`,
        method: 'PUT',
        body: roleData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Role', id },
        'Role'
      ]
    }),

    // Delete role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/prisma/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Role']
    })
  })
});

export const {
useGetRolesDataQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation
} = roleApi;