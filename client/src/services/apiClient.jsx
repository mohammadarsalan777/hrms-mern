import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
})


// Request Interceptor → Attach JWTa
apiClient.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
})


// Response Interceptor → Handle Errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default apiClient;