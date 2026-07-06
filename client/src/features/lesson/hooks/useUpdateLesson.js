import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLesson } from "../services/lessonService";

const useUpdateLesson = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["module", id, "lessons"] })
        }
    });
};

export default useUpdateLesson;