import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../services/notificationService";

const useFetchNotifications = (limit = 10) => {
    return useInfiniteQuery({
        queryKey: ["notifications"],

        queryFn: ({ pageParam = 1 }) =>
            fetchNotifications(pageParam, limit),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            return lastPage.data.pagination.hasNext
                ? lastPage.data.pagination.page + 1
                : undefined;
        },
    });
};

export default useFetchNotifications;