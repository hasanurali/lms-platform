import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoubtReply } from "../services/doubtService";

const useAddDoubtReply = (id) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addDoubtReply,
        onSuccess: () => {
            queryClient.invalidateQueries(["doubts", id])
        }
    });
};

export default useAddDoubtReply;