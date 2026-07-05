import { useMutation } from "@tanstack/react-query";
import { createModule } from "../services/moduleServices";

const useCreateModule = () => {

    return useMutation({
        mutationFn: createModule,
    });
};

export default useCreateModule;