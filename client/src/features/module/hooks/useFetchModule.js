import { useQuery } from "@tanstack/react-query";
import { fetchModule } from "../services/moduleServices";

const useFetchModule = (id) => {
    return useQuery({
        queryKey: ["modules", id],
        queryFn: () => fetchModule(id),
        enabled: !!id
    });
};

export default useFetchModule;