import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../services/authService";
import { useNavigate } from "react-router-dom"
import { de } from "zod/v4/locales";

const useVerifyOtp = () => {

  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      localStorage.removeItem("verify-email")
      navigate("/", { replace: true })
    }
  });
};

export default useVerifyOtp;