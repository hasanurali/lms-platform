import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const markLessonComplete = async (data) => {
    const response = await api.post(
        ENDPOINTS.PROGRESS.MARKCOMPLETE,
        data
    );

    return response.data;
};

export const fetchProgress = async (id) => {
    const response = await api.get(
        ENDPOINTS.PROGRESS.FETCH(id)
    );

    return response.data;
};