import axiosPrivate from "./axiosPrivate";

const axiosInstance = axiosPrivate(); // Get configured axios instance

// Custom baseQuery wrapper for RTK Query
export const axiosBaseQuery =
    () =>
        async ({ url, method = "GET", data, params }) => {
            try {
                const result = await axiosInstance({
                    url,
                    method,
                    data,
                    params,
                });
                return { data: result.data };
            } catch (axiosError) {
                let err = axiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };
