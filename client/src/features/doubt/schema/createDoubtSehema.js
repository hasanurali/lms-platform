import { z } from "zod";

const createDoubtSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be under 100 characters")
        .trim(),

    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters")
        .max(5000, "Description must be under 5000 characters")
        .trim(),
});

export default createDoubtSchema;

