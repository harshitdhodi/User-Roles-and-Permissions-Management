import { apiSlice } from './apiSlice';

export const SmtpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create SMTP Details
    createSmtpDetails: builder.mutation({
      query: (smtpDetails) => ({
        url: '/smtp-details',
        method: 'POST',
        body: smtpDetails
      }),
      invalidatesTags: ['SmtpDetails']
    }),

    // Get SMTP Details by ID
    getSmtpDetailsById: builder.query({
      query: (id) => `/smtp-details/${id}`,
      providesTags: (result, error, id) => 
        result ? [{ type: 'SmtpDetails', id }] : []
    }),

    // Get SMTP Details by User ID
    getSmtpDetailsByUserId: builder.query({
      query: (userId) => `/smtp-details/user/${userId}`,
      providesTags: (result, error, userId) => 
        result ? [{ type: 'SmtpDetails', id: userId }] : []
    }),

    // Update SMTP Details
    updateSmtpDetails: builder.mutation({
      query: ({ id, smtpDetails }) => ({
        url: `/smtp-details/${id}`,
        method: 'PUT',
        body: smtpDetails
      }),
      invalidatesTags: (result, error, { id }) => 
        result ? [{ type: 'SmtpDetails', id }] : []
    }),

    // Delete SMTP Details
    deleteSmtpDetails: builder.mutation({
      query: (id) => ({
        url: `/smtp-details/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => 
        result ? [{ type: 'SmtpDetails', id }] : []
    })
  })
});

// Export hooks for usage in functional components
export const {
  useCreateSmtpDetailsMutation,
  useGetSmtpDetailsByIdQuery,
  useGetSmtpDetailsByUserIdQuery,
  useUpdateSmtpDetailsMutation,
  useDeleteSmtpDetailsMutation
} = SmtpApi;