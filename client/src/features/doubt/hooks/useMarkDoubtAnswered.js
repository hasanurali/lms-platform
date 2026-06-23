import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markDoubtAnswered } from "../services/doubtService";

const useMarkDoubtAnswered = (lessonId, doubtId) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markDoubtAnswered,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons", lessonId, "doubts"] });
            queryClient.invalidateQueries({ queryKey: ["doubts", doubtId] });
        }
    });
};

export default useMarkDoubtAnswered;