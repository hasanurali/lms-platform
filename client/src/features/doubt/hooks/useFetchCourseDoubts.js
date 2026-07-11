import { useQuery } from "@tanstack/react-query";
import { fetchCourseDoubts } from "../services/doubtService";

const useFetchCourseDoubts = (id, page = 1, limit = 8) => {

    return useQuery({
        queryKey: ["course", id, "doubts", page, limit],
        queryFn: () => fetchCourseDoubts(id, page, limit),
        enabled: !!id
    });
};

export default useFetchCourseDoubts;