import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markLessonComplete } from "../services/progressService";

const useMarkLessonComplete = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markLessonComplete,
        onSuccess:()=>{
            queryClient.invalidateQueries(["courses", id])
        }
    });
};

export default useMarkLessonComplete;