import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import VideoPlayer from "../components/VideoPlayer";
import useFetchLesson from "../hooks/useFetchLesson";


const LessonVideoPlayer = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isPending, isError } = useFetchLesson(id);
    const lesson = data?.data;


    if (isPending) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f9fb" }}>
                <CircularProgress sx={{ color: "#1a146b" }} />
            </Box>
        );
    }

    if (!lesson) return null;

    return (
        <Box sx={{ minHeight: "100vh", background: "#f7f9fb", fontFamily: "'DM Sans', sans-serif" }}>

            {/* Top bar */}
            <Box sx={{
                position: "sticky", top: 0, zIndex: 40,
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid #eceef0",
                height: 60, display: "flex", alignItems: "center",
                px: { xs: 2, md: 4 }, gap: 2,
            }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    size="small"
                    sx={{ color: "#1a146b", "&:hover": { background: "rgba(26,20,107,0.06)" } }}
                >
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: 14, md: 17 }, fontWeight: 700,
                    color: "#1a146b", letterSpacing: "-0.01em",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {lesson.title}
                </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>

                {/* Video player */}
                <VideoPlayer url={lesson.video} title={lesson.title} />

                {/* Lesson info */}
                <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Title */}
                    <Box>
                        <Typography sx={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                            textTransform: "uppercase", color: "#44b5a8", mb: 0.75,
                        }}>
                            Lesson {lesson.order}
                        </Typography>
                        <Typography sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: { xs: 22, md: 28 }, fontWeight: 800,
                            color: "#1a146b", letterSpacing: "-0.02em", lineHeight: 1.2,
                        }}>
                            {lesson.title}
                        </Typography>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: 1, background: "#eceef0" }} />

                    {/* Content / notes */}
                    {lesson.content ? (
                        <Box>
                            <Typography sx={{
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                                textTransform: "uppercase", color: "#474651", mb: 2,
                            }}>
                                Lesson Notes
                            </Typography>
                            <Typography sx={{ fontSize: 15, color: "#474651", lineHeight: 1.8 }}>
                                {lesson.content}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            background: "#fff", borderRadius: "12px",
                            p: 3, border: "1px dashed #c8c5d3",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Typography sx={{ fontSize: 13, color: "#a0a0a8" }}>
                                No notes for this lesson.
                            </Typography>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
};

export default LessonVideoPlayer;