import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const createDoubt = async (data) => {
    const response = await api.post(
        ENDPOINTS.DOUBT.CREATE,
        data
    );

    return response.data;
};

export const fetchLessonDoubt = async (id) => {
    const response = await api.get(
        ENDPOINTS.DOUBT.FETCHLESSON(id)
    );

    return response.data;
};