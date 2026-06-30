import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../services/reviewService"

const useDeleteReview = (courseId) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReview,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", res.data?.course] })
            queryClient.invalidateQueries({ queryKey: ["courses", res.data?.course] })
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
        }
    });
};

export default useDeleteReview;