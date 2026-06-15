import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReview } from "../services/reviewService"

const useUpdateReview = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateReview(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", res.data.course] })
        }
    });
};

export default useUpdateReview;