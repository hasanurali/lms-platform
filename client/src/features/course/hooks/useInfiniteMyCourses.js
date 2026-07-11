import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMyCourse } from "../services/courseService";

const useInfiniteMyCourses = (limit = 10, published = true) => {
    return useInfiniteQuery({
        queryKey: ["my-courses", limit, published],

        queryFn: ({ pageParam = 1 }) =>
            fetchMyCourse(pageParam, limit, published),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {

            const pagination = lastPage?.pagination;

            return pagination?.hasNext ? pagination.page + 1 : undefined;
        },
    });
};

export default useInfiniteMyCourses;