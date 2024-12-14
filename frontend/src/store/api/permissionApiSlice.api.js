// permissionApiSlice.js
import { apiSlice } from './apiSlice';

export const permissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Permissions endpoints
    getPermissions: builder.query({
      query: () => '/permissions',
      providesTags: ['Permission']
    }),
    // /roles/permissions
    getAllRolePermissions: builder.query({
      query: () => '/permissions/roles/permissions',
      providesTags: ['Permission']
    }),
    getPermissionById: builder.query({
      query: (id) => `/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permission', id }]
    }),

    createPermission: builder.mutation({
      query: (data) => ({
        url: '/permissions',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Permission']
    }),

    updatePermission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/permissions/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Permission', id },
        'Permission'
      ]
    }),

    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Permission']
    }),

    // Role Permissions endpoints
    assignPermissionToRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/permissions/roles/${roleId}`,
        method: 'POST',
        body: { permissionId }
      }),
      invalidatesTags: ['Permission', 'Role']
    }),

    removePermissionFromRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/permissions/roles/${roleId}/${permissionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Permission', 'Role']
    })
  })
});


export const {
  useGetPermissionsQuery,
  useGetAllRolePermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation
} = permissionApi;