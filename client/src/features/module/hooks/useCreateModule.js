import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createModule } from "../services/moduleServices";

const useCreateModule = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createModule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id, "modules"] })
        }
    });
};

export default useCreateModule;