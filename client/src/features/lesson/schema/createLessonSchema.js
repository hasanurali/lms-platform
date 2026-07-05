import { z } from "zod";

const createLessonSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(3, "Title must be 3-50 characters")
        .max(50, "Title must be 3-50 characters"),
    content: z
        .string()
        .trim()
        .max(1000, "Content must be less than 1000 characters")
        .optional()
        .or(z.literal("")),
});

export default createLessonSchema;