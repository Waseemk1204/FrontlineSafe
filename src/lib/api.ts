import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For httpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token if available (though we use httpOnly cookies for refresh, access token might be in memory)
// Actually, the plan says "return tokens in body for API-first dev" but also "httpOnly secure cookie flow".
// Usually with httpOnly cookies, we don't need to manually attach headers unless we are using a hybrid approach.
// The backend plan said: "Response 200: { user, tokens } (set httpOnly cookie: refreshToken)"
// And "POST /api/auth/refresh ... Response: { accessToken, refreshToken }"
// So we probably get an accessToken to use in Authorization header.

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt refresh
                const { data } = await api.post('/auth/refresh');
                setAccessToken(data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login or handle logout
                setAccessToken(null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
