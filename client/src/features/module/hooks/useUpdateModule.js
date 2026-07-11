import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModule } from "../services/moduleServices";

const useUpdateModule = (id) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateModule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id, "modules"] })
        }
    });
};

export default useUpdateModule;