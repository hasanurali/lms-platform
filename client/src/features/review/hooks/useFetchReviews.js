import { useQuery } from "@tanstack/react-query"
import { fetchReviews } from "../services/reviewService"

const useFetchReviews = (id) => {
    return useQuery({
        queryKey: ["reviews", id],
        queryFn: () => fetchReviews(id)
    })
};

export default useFetchReviews;