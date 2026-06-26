import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const fetchNotifications = async (page = 1, limit = 10) => {
    const response = await api.get(
        ENDPOINTS.NOTIFICATION.FETCH(page, limit)
    );

    return response.data;
};