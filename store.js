import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";         // RTK Query API 1
import { userApi } from "./userApi";      // RTK Query API 2
import { authApi } from "./api.authSlice"; // RTK Query Auth API
import authReducer from "./authReducer";  // Normal Redux slice (optional)

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,          // RTK Query API 1
        [userApi.reducerPath]: userApi.reducer,  // RTK Query API 2
        [authApi.reducerPath]: authApi.reducer,  // RTK Query Auth API
        auth: authReducer,                        // Normal slice (if needed)
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        api.middleware,          // RTK Query API 1 middleware
        userApi.middleware,      // RTK Query API 2 middleware
        authApi.middleware,      // RTK Query Auth API middleware
    ],
});
