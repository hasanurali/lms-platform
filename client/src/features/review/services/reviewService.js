import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchReviews = async (id) => {
    const response = await api.get(
        ENDPOINTS.REVIEW.FETCH(id)
    );

    return response.data;
};