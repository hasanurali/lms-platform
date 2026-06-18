import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchLesson = async (id) => {
    const response = await api.get(
        ENDPOINTS.LESSON.FETCH(id)
    );

    return response.data;
};