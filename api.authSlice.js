import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL
            ? `${process.env.REACT_APP_BACKEND_URL}/api`
            : "http://3.109.159.43:8086/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Save token in localStorage
                    localStorage.setItem("token", data.token);
                } catch (err) {
                    console.error("Login failed:", err);
                }
            },
            invalidatesTags: ["Auth"],
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: "/auth/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Auth"],
        }),

        logout: builder.mutation({
            queryFn: async () => {
                // Just remove token
                localStorage.removeItem("token");
                return { data: true };
            },
            invalidatesTags: ["Auth"],
        }),

        getProfile: builder.query({
            query: () => "/auth/profile",
            providesTags: ["Auth"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
} = authApi;
