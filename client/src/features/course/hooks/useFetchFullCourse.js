import { useQuery } from "@tanstack/react-query";
import { fetchFullCourse } from "../services/courseService";

const useFetchFullCourse = (id) => {
    return useQuery({
        queryKey: ["courses", id],
        queryFn: () => fetchFullCourse(id)
    });
};

export default useFetchFullCourse;