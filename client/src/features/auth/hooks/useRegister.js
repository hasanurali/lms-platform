import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {

  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      localStorage.setItem("verify-email", res?.data?.email)
      navigate("/auth/verify-otp", { replace: true })
    }
  });
};