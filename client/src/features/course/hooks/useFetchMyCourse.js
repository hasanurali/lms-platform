import { useQuery } from "@tanstack/react-query"
import { fetchMyCourse } from "../services/courseService"

const useFetchMyCourse = (role, page, limit, published = null) => {

    return useQuery({
        queryKey: ["my-courses", page, limit],
        queryFn: () => fetchMyCourse(page, limit, published),
        enabled: role !== "student"
    })
};

export default useFetchMyCourse;