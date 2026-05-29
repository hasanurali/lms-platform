import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

const useLogin = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth-user"], data.data);
      navigate("/", { replace: true })
    },
  });
};

export default useLogin;