import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { refreshToken } from "@/features/auth/services/authService";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    const queue = [...failedQueue];
    failedQueue = [];

    queue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (!originalRequest || !err.response) {
            return Promise.reject(err);
        }

        const isAuthRoute =
            originalRequest.url.includes(ENDPOINTS.AUTH.LOGIN) ||
            originalRequest.url.includes(ENDPOINTS.AUTH.REFRESH);

        if (
            err.response.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            originalRequest._retry = true;


            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(api(originalRequest)),
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                await refreshToken();
                processQueue(null);
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr);

                const guestAndPublicRoutes = [
                    "/",
                    "/courses",
                    "/auth/login",
                    "/auth/register",
                    "/auth/verify-otp",
                ];

                if (!guestAndPublicRoutes.includes(window.location.pathname)) {
                    window.location.href = "/auth/login";
                }

                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default api;