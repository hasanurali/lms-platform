import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchLesson = async (id) => {
    const response = await api.get(
        ENDPOINTS.LESSON.FETCH(id)
    );

    return response.data;
};

export const createLesson = async (data) => {
    const response = await api.post(
        ENDPOINTS.LESSON.CREATE(data.id),
        data.data
    );

    return response.data;
};

export const fetchAllLessons = async (id) => {
    const response = await api.get(
        ENDPOINTS.LESSON.FETCHALL(id),
    );

    return response.data;
};