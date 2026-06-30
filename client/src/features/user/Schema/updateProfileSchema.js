import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be 3-30 characters")
        .max(30, "Name must be 3-30 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters")
        .optional()
        .or(z.literal("")),

    bio: z
        .string()
        .trim()
        .max(500, "Bio must be less than 500 characters")
        .optional()
        .or(z.literal("")),
});

export default updateProfileSchema;