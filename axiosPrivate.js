import axios from "axios";

// Custom axios instance
const axiosPrivate = () => {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL
            ? `${process.env.REACT_APP_BACKEND_URL}/api`
            : "http://3.109.159.43:8086/api",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Always read token before request
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token") || ""; // or get from Redux
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};

export default axiosPrivate;
