import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const registerUser = async (data) => {
    const response = await api.post(
        ENDPOINTS.AUTH.REGISTER,
        data
    );

    return response.data;
};

export const verifyOtp = async (data) => {
    const response = await api.post(
        ENDPOINTS.AUTH.VERIFY_EMAIL,
        data
    );

    return response.data;
};

export const resendOtp = async (data) => {
    const response = await api.post(
        ENDPOINTS.AUTH.RESEND_OTP,
        data
    );

    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post(
        ENDPOINTS.AUTH.LOGIN,
        data
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get(
        ENDPOINTS.USER.ME
    );

    return response.data?.data;
};

export const refreshToken = async () => {
    const response = await api.post(
        ENDPOINTS.AUTH.REFRESH
    );

    return;
};

export const logoutUser = async () => {
    const response = await api.post(
        ENDPOINTS.AUTH.LOGOUT
    );

    return;
};