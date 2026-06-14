import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchReviews = async (id) => {
    const response = await api.get(
        ENDPOINTS.REVIEW.FETCH(id)
    );

    return response.data;
};

export const createReview = async (data) => {
    const response = await api.post(
        ENDPOINTS.REVIEW.CREATE(data?.id),
        data?.data
    );

    return response.data;
};

export const updateReview = async (data) => {
    const response = await api.put(
        ENDPOINTS.REVIEW.UPDATE(data?.id),
        data?.data
    );

    return response.data;
};