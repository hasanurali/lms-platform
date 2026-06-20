import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const createDoubt = async (data) => {
    const response = await api.post(
        ENDPOINTS.DOUBT.CREATE,
        data
    );

    return response.data;
};