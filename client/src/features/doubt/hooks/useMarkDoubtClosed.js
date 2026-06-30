import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markDoubtClosed } from "../services/doubtService";

const useMarkDoubtClosed = (lessonId, doubtId) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markDoubtClosed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons", lessonId, "doubts"] });
            queryClient.invalidateQueries({ queryKey: ["doubts", doubtId] });
            queryClient.invalidateQueries({ queryKey: ["my-doubts"] });
        }
    });
};

export default useMarkDoubtClosed;