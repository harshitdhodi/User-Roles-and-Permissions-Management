// activityLogApiSlice.js
import { apiSlice } from './apiSlice';

export const activityLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all activity logs
    getActivityLogs: builder.query({
      query: () => '/user-activity-logs',
      providesTags: ['ActivityLog']
    }),

    // Get activity log by ID
    getActivityLogById: builder.query({
      query: (id) => `/user-activity-logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'ActivityLog', id }]
    }),

    // Create new activity log
    createActivityLog: builder.mutation({
      query: (logData) => ({
        url: '/user-activity-logs',
        method: 'POST',
        body: logData
      }),
      invalidatesTags: ['ActivityLog']
    }),

    // Update activity log
    updateActivityLog: builder.mutation({
      query: ({ id, ...logData }) => ({
        url: `/user-activity-logs/${id}`,
        method: 'PUT',
        body: logData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ActivityLog', id },
        'ActivityLog'
      ]
    }),

    // Delete activity log
    deleteActivityLog: builder.mutation({
      query: (id) => ({
        url: `/user-activity-logs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ActivityLog']
    })
  })
});

export const {
  useGetActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useCreateActivityLogMutation,
  useUpdateActivityLogMutation,
  useDeleteActivityLogMutation
} = activityLogApi;