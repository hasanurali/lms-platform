import { useMutation } from "@tanstack/react-query";
import { createDoubt } from "../services/doubtService";

const useCreateDoubt = () => {
    return useMutation({
        mutationFn: createDoubt,
    });
};

export default useCreateDoubt;