import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";

import RenderStars from "@/features/course/components/RenderStars"

const MAX_CHARS = 160;

const ReviewCard = ({ review }) => {


    const [expanded, setExpanded] = useState(false);

    const isLong = review.message?.length > MAX_CHARS;
    const displayText = isLong && !expanded
        ? review.message.slice(0, MAX_CHARS).trimEnd() + "..."
        : review.message;


    const formattedDate = review.date
        ? new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "";

    return (
        <Box sx={{
            background: "#ffffff",
            borderRadius: "14px",
            p: { xs: "18px", sm: "22px" },
            boxShadow: "0 2px 8px rgba(25,28,30,0.06)",
            border: "1px solid rgba(200,197,211,0.15)",
            display: "flex", flexDirection: "column", gap: 2,
            transition: "box-shadow 0.25s, transform 0.25s",
            "&:hover": {
                boxShadow: "0 8px 28px rgba(25,28,30,0.11)",
                transform: "translateY(-2px)",
            },
        }}>

            {/* Tob bar avatar, name and date */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                        src={review.profilePicture}
                        sx={{
                            width: 38, height: 38, flexShrink: 0,
                            background: "linear-gradient(135deg, #1a146b, #312e81)",
                            fontSize: 13, fontWeight: 700,
                        }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{
                            fontSize: 14, fontWeight: 700, color: "#191c1e",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                            {review.name}
                        </Typography>
                        {formattedDate && (
                            <Typography sx={{ fontSize: 10, color: "#a0a0a8" }}>
                                {formattedDate}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Stars */}
                <RenderStars rating={review.rating} />

            </Box>

            {/* Message */}
            <Box>
                <Typography sx={{
                    fontSize: 13.5, color: "#474651", lineHeight: 1.75,
                    wordBreak: "break-word",
                }}>
                    {displayText}
                </Typography>
                {isLong && (
                    <Typography
                        component="button"
                        onClick={() => setExpanded(v => !v)}
                        sx={{
                            mt: 0.75, fontSize: 12, fontWeight: 700,
                            color: "#1a146b", background: "none", border: "none",
                            cursor: "pointer", p: 0, fontFamily: "'DM Sans', sans-serif",
                            textDecoration: "underline", textUnderlineOffset: "3px",
                            "&:hover": { color: "#44b5a8" },
                            transition: "color 0.2s",
                        }}
                    >
                        {expanded ? "Show less" : "Show more"}
                    </Typography>
                )}
            </Box>

        </Box>
    );
};

export default ReviewCard;
