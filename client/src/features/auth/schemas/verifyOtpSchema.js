import { z } from "zod";

const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numbers only"),
});

export default verifyOtpSchema;