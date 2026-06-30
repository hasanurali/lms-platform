import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createReview } from "../services/reviewService";

const useCreateReview = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createReview(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", res.data?.course] })
            queryClient.invalidateQueries({ queryKey: ["courses", res.data?.course] })
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
        }
    })
};

export default useCreateReview;