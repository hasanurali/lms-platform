import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoubt } from "../services/doubtService";

const useCreateDoubt = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createDoubt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons", id, "doubts"] })
            queryClient.invalidateQueries({ queryKey: ["my-doubts"] })
        }
    });
};

export default useCreateDoubt;