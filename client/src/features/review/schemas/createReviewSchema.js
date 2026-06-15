import { z } from "zod"

const createReviewSchema = z.object({
    rating: z
        .number({ invalid_type_error: "Please select a rating." })
        .min(1, "Please select a rating.")
        .max(5),

    message: z
        .string()
        .min(10, "Review must be at least 10 characters.")
        .max(500, "Review must be under 500 characters."),
});

export default createReviewSchema;