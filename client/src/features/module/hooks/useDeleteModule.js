import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteModule } from "../services/moduleServices";

const useDeleteModule = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteModule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id, "modules"] })
        }
    });
};

export default useDeleteModule;