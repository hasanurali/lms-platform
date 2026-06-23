import { z } from "zod";

const doubtReplySchema = z.object({
    message: z
        .string()
        .min(1, "Message is required")
        .min(1, "Message must be at least 5 characters")
        .max(5000, "Message must be under 5000 characters")
        .trim(),
});

export default doubtReplySchema;