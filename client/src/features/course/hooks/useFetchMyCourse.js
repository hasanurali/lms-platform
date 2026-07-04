import { useQuery } from "@tanstack/react-query"
import { fetchMyCourse } from "../services/courseService"

const useFetchMyCourse = (role, page, limit) => {

    return useQuery({
        queryKey: ["my-courses", page, limit],
        queryFn: () => fetchMyCourse(page, limit),
        enabled: role !== "student"
    })
};

export default useFetchMyCourse;