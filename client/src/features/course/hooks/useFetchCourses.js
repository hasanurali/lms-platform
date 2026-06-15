import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../services/courseService";

const useFetchCourses = (page, limit) => {
    return useQuery({
        queryKey: ["courses", page, limit],
        queryFn: () => fetchCourses(page, limit),
    });
};

export default useFetchCourses;