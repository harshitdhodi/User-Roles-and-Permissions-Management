import { apiSlice } from "./apiSlice";

export const passwordApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Create Password Reset Token
      createPasswordResetToken: builder.mutation({
        query: (tokenData) => ({
          url: '/password-reset-tokens',
          method: 'POST',
          body: tokenData
        })
      }),
  
    // Get All Password Reset Tokens
      getAllPasswordResetTokens: builder.query({
        query: () => '/password-reset-tokens'
      }),
  
      // Get Password Reset Token by ID
      getPasswordResetTokenById: builder.query({
        query: (tokenId) => `/password-reset-tokens/${tokenId}`
      }),
  
      // Update Password Reset Token
      updatePasswordResetToken: builder.mutation({
        query: ({ tokenId, tokenData }) => ({
          url: `/password-reset-tokens/${tokenId}`,
          method: 'PUT',
          body: tokenData
        })
      }),
  
      // Delete Password Reset Token
      deletePasswordResetToken: builder.mutation({
        query: (tokenId) => ({
          url: `/password-reset-tokens/${tokenId}`,
          method: 'DELETE'
        })
      })
    })
  });
  
  // Export hooks for usage in components
  export const {
    useCreatePasswordResetTokenMutation,
    useGetAllPasswordResetTokensQuery,
    useGetPasswordResetTokenByIdQuery,
    useUpdatePasswordResetTokenMutation,
    useDeletePasswordResetTokenMutation
  } = passwordApi;