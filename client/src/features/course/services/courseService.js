import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchCourses = async (page = 1, limit = 8) => {
    const response = await api.get(
        ENDPOINTS.COURSE.FETCH(page, limit)
    );

    return response.data;
};

export const fetchFullCourse = async (id) => {
    const response = await api.get(
        ENDPOINTS.COURSE.FULL(id)
    );

    return response.data;
};

export const fetchMyCourse = async (page = 1, limit = 3) => {
    const response = await api.get(
        ENDPOINTS.COURSE.FETCHMY(page, limit)
    );

    return response.data;
};

export const createCourse = async (data) => {
    const response = await api.post(
        ENDPOINTS.COURSE.CREATE,
        data
    );

    return response.data;
};

export const updateCourse = async (data) => {
    const response = await api.put(
        ENDPOINTS.COURSE.UPDATE(data.id),
        data.data
    );

    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await api.delete(
        ENDPOINTS.COURSE.DELETE(id)
    );

    return response.data;
};

export const publishCourse = async (id) => {
    const response = await api.put(
        ENDPOINTS.COURSE.UPDATE(id),
        { isPublished: true }
    );

    return response.data;
};