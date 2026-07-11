import { z } from "zod";

const createModuleSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(3, "Title must be 3-50 characters")
        .max(50, "Title must be 3-50 characters")
});

export default createModuleSchema;