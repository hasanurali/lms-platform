import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markLessonComplete } from "../services/progressService";

const useMarkLessonComplete = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markLessonComplete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses", id] })
            queryClient.invalidateQueries({ queryKey: ['courseProgress', id] })
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
            queryClient.invalidateQueries({ queryKey: ["progress", id] })
        }
    });
};

export default useMarkLessonComplete;