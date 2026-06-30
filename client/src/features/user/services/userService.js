import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const updateProfile = async (data) => {
    const response = await api.put(
        ENDPOINTS.USER.UPDATE,
        data
    );

    return response.data;
};