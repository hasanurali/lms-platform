import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const createModule = async (data) => {
    const response = await api.post(
        ENDPOINTS.MODULE.CREATE(data.id),
        { title: data.title }
    );

    return response.data;
};