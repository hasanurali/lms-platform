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