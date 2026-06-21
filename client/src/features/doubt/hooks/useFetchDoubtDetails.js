import { useQuery } from "@tanstack/react-query";
import { fetchDoubtDetails } from "../services/doubtService";

const useFetchDoubtDetails = (id) => {

    return useQuery({
        queryKey: ["doubts", id],
        queryFn: () => fetchDoubtDetails(id),
    });
};

export default useFetchDoubtDetails;