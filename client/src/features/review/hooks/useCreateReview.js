import { useMutation } from "@tanstack/react-query";
import { createReview } from "../services/reviewService";

const useCreateReview = () => {
    return useMutation({
        mutationFn: (data) => createReview(data),
    })
};

export default useCreateReview;