import { useQuery } from "@tanstack/react-query";
import { fetchLesson } from "../services/lessonService";

const useFetchLesson = (id) => {
    return useQuery({
        queryKey: ["lessons", id],
        queryFn: () => fetchLesson(id),
    });
};

export default useFetchLesson;