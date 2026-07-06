import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLesson } from "../services/lessonService";

const useDeleteLesson = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["module", id, "lessons"] })
        }
    });
};

export default useDeleteLesson;