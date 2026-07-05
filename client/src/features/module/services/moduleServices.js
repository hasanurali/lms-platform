import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const createModule = async (data) => {
    const response = await api.post(
        ENDPOINTS.MODULE.CREATE(data.id),
        { title: data.title }
    );

    return response.data;
};

export const fetchModule = async (id) => {
    const response = await api.get(
        ENDPOINTS.MODULE.FETCH(id)
    );

    return response.data;
};

export const updateModule = async (data) => {
    const response = await api.put(
        ENDPOINTS.MODULE.UPDATE(data.id),
        { title: data.title }
    );

    return response.data;
};

export const deleteModule = async (id) => {
    const response = await api.delete(
        ENDPOINTS.MODULE.DELETE(id)
    );

    return response.data;
};