import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLesson } from "../services/lessonService";

const useCreateLesson = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["module", id, "lessons"] })
        }
    });
};

export default useCreateLesson;