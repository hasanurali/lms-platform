import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../services/reviewService"

const useDeleteReview = (courseId) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReview,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", courseId] })
        }
    });
};

export default useDeleteReview;