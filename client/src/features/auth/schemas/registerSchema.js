import { z } from "zod";

const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Name must be 3-30 characters")
            .max(30, "Name must be 3-30 characters")
            .regex(
                /^[a-zA-Z\s]+$/,
                "Name must contain only letters"
            ),

        email: z.email("Invalid email format"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Must contain at least one uppercase letter"
            ).regex(
                /[a-z]/,
                "Must contain at least one lowercase letter"
            ).regex(
                /[0-9]/,
                "Must contain at least one number"
            ).regex(
                /[@$!%*?&]/,
                "Must contain at least one special character"
            ),

        confirmPassword: z.string().min(1, "Please confirm your password"),

        role: z
            .enum(["student", "instructor"])
            .optional()

    }).refine((data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export default registerSchema;