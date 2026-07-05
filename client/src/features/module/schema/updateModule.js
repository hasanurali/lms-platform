import { z } from "zod";

const updateModuleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be 50 characters or less")
    .optional()
    .or(z.literal("")), 
});

export default updateModuleSchema;