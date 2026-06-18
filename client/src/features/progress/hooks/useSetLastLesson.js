import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setLastLesson } from "../services/progressService";

const useSetLastLesson = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: setLastLesson,
        onSuccess: () => {
            queryClient.invalidateQueries(["courses", id])
        }
    });
};

export default useSetLastLesson;