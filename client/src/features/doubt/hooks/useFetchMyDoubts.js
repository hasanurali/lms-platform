import { useQuery } from "@tanstack/react-query";
import { fetchMyDoubts } from "../services/doubtService";

const useFetchMyDoubts = () => {
    return useQuery({
        queryKey: ["my-doubts"],
        queryFn: fetchMyDoubts
    });
};

export default useFetchMyDoubts;