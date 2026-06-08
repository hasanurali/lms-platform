import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.clear();
            navigate("/");
        },
    });
};

export default useLogout;