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

export const fetchDoubtDetails = async (id) => {

    if (!id) {
        return null;
    }

    const response = await api.get(
        ENDPOINTS.DOUBT.FETCHDETAILS(id)
    );

    return response.data;
};

export const addDoubtReply = async (data) => {
    const response = await api.post(
        ENDPOINTS.DOUBT.REPLY(data.id),
        data.data
    );

    return response.data;
};

export const markDoubtAnswered = async (id) => {
    const response = await api.put(
        ENDPOINTS.DOUBT.MARKANSWER(id)
    );

    return response.data;
};