import { apiSlice } from "./apiSlice";

export const sessionApi = apiSlice.injectEndpoints({
    tagTypes: ['UserSession', 'UserSessions'],
    endpoints: (builder) => ({
        // Create a new user session
        createUserSession: builder.mutation({
            query: (sessionData) => ({
                url: '/user-sessions',
                method: 'POST',
                body: sessionData
            }),
            invalidatesTags: ['UserSessions']
        }),

        // Get all user sessions
        getAllUserSessions: builder.query({
            query: () => '/user-sessions',
            providesTags: ['UserSessions']
        }),

        // Get user session by ID
        getUserSessionById: builder.query({
            query: (sessionId) => `/user-sessions/${sessionId}`,
            providesTags: (result, error, sessionId) => [
                { type: 'UserSession', id: sessionId }
            ]
        }),

        // Update user session
        updateUserSession: builder.mutation({
            query: ({ id, ...sessionData }) => ({
                url: `/user-sessions/${id}`,
                method: 'PUT',
                body: sessionData
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'UserSession', id },
                'UserSessions'
            ]
        }),

        // Delete user session
        deleteUserSession: builder.mutation({
            query: (sessionId) => ({
                url: `/user-sessions/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, sessionId) => [
                { type: 'UserSession', id: sessionId },
                'UserSessions'
            ]
        })
    })
});

// Export hooks for usage in components
export const {
    useCreateUserSessionMutation,
    useGetAllUserSessionsQuery,
    useGetUserSessionByIdQuery,
    useUpdateUserSessionMutation,
    useDeleteUserSessionMutation
} = sessionApi;