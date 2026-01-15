import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // You could handle global errors here, like 401 redirects
        return Promise.reject(error);
    }
);

export default apiClient;
