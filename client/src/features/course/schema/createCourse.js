import { z } from "zod";

const createCourseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(3, "Title must be 3-50 characters")
        .max(50, "Title must be 3-50 characters"),

    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(10, "Description must be 10-500 characters")
        .max(500, "Description must be 10-500 characters"),

    price: z
        .number()
        .int("Price must be an integer")
        .min(0, "Price must be between 0 and 100000")
        .max(100000, "Price must be between 0 and 100000")
        .optional(),
});


export default createCourseSchema;
