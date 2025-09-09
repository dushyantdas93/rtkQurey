import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";       // 1st API
import { userApi } from "./userApi";   // 2nd API
import authReducer from "./authSlice"; // Normal slice

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,         // RTK Query API reducer 1
        [userApi.reducerPath]: userApi.reducer, // RTK Query API reducer 2
        auth: authReducer,                      // Normal slice
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        api.middleware,
        userApi.middleware,
    ],
});
