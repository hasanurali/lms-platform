import { useQuery } from "@tanstack/react-query";
import { fetchProgress } from "../services/progressService";

const useFetchProgress = (courseId) => {

    return useQuery({
        queryKey: ["progress", courseId],
        queryFn: () => fetchProgress(courseId)
    });
};

export default useFetchProgress;