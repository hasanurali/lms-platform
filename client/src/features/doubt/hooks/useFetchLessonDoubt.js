import { useQuery } from "@tanstack/react-query";
import { fetchLessonDoubt } from "../services/doubtService";

const useFetchLessonDoubt = (id) => {
    return useQuery({
        queryKey: ["lessons", id, "doubts"],
        queryFn: () => fetchLessonDoubt(id)
    });
};

export default useFetchLessonDoubt;