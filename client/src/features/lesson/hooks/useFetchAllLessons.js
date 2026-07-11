import { useQuery } from "@tanstack/react-query";
import { fetchAllLessons } from "../services/lessonService";

const useFetchAllLessons = (id) => {
    return useQuery({
        queryKey: ["module", id, "lessons"],
        queryFn: () => fetchAllLessons(id),
        enabled: !!id
    });
};

export default useFetchAllLessons;