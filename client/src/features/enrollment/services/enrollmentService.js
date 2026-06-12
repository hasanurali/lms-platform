import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const enrollCourse = async (id) => {
    const response = await api.post(
        ENDPOINTS.ENROLLMENT.ENROLL(id)
    );

    return response.data;
};

export const fetchEnrolledCourses = async (id) => {
    const response = await api.get(
        ENDPOINTS.ENROLLMENT.FETCHCOURSES
    );

    return response.data;
};