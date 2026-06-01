import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authService";

const useAuthUser = () => {
    return useQuery({
        queryKey: ["auth-user"],
        queryFn: getCurrentUser,
    });
};

export default useAuthUser;