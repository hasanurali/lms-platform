import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoubt } from "../services/doubtService";

const useCreateDoubt = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createDoubt,
        onSuccess: () => {
            queryClient.invalidateQueries(["lessons", id, "doubts"])
        }
    });
};

export default useCreateDoubt;