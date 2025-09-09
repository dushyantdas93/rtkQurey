import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBaseQuery";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }), // replace fetchBaseQuery to axiosBaseQuery()
    tagTypes: ["Tasks", "Customer"], //,"DeclarationOfFunction"
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => "/tasks",
            transformResponse: (tasks) => tasks.reverse(),
            providesTags: ["Tasks"], // ,"sayThisIsMyFnNameForCall"
        }),
        getCustomers: builder.query({
            query: ({ page = 0, size = 10, filter = {},token }) => ({
                url: "/customers/search",
                method: "POST",
                params: { page, limit },
                body: filter,
                // headers: {                 // this is option if your base url is not allready added header
                //     Authorization: `Bearer ${token}`, // add token here
                //     "Content-Type": "application/json",
                // },
                // headers: {
                //     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                //     "Content-Type": "application/json",
                // },
            }),
            transformResponse: (customNameOfThisParameter) => customNameOfThisParameter.reverse(),
            providesTags: ["Customer"],
        }),
        addTask: builder.mutation({
            query: (task) => ({
                url: "/tasks",
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Tasks"], // ,"DeclareFnNameCallHereAfterMutation"
            async onQueryStarted(task, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (draft) => {
                        draft.unshift({ id: crypto.randomUUID(), ...task });
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateTask: builder.mutation({
            query: ({ id, ...updatedTask }) => ({
                url: `/tasks/${id}`,
                method: "PATCH",
                body: updatedTask,
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(
                { id, ...updatedTask },
                { dispatch, queryFulfilled },
            ) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (tasksList) => {
                        const taskIndex = tasksList.findIndex((el) => el.id === id);
                        tasksList[taskIndex] = { ...tasksList[taskIndex], ...updatedTask };
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData("getTasks", undefined, (tasksList) => {
                        const taskIndex = tasksList.findIndex((el) => el.id === id);
                        tasksList.splice(taskIndex, 1);
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetTasksQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = api;