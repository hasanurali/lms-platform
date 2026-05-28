import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default loginSchema;