import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchCourses = async (page = 1, limit = 8) => {
    const response = await api.get(
        ENDPOINTS.COURSE.FETCH(page, limit)
    );

    return response.data;
};