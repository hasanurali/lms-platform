import { useQuery } from "@tanstack/react-query";
import { fetchModule } from "../services/moduleServices";

const useFetchModule = (id) => {
    return useQuery({
        queryKey: ["course", id, "modules"],
        queryFn: () => fetchModule(id),
        enabled: !!id
    });
};

export default useFetchModule;