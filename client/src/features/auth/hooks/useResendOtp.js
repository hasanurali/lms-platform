import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "../services/authService";

const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
    });
};

export default useResendOtp;