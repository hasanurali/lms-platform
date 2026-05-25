import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const registerUser = async (data) => {
    const response = await api.post(
        ENDPOINTS.AUTH.REGISTER,
        data
    );

    return response.data;
};