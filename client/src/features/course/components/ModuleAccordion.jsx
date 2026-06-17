import react, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/LockOutlined"


const ModuleAccordion = ({ module, index, isEnrolled }) => {
    const [open, setOpen] = useState(index === 0);
    const totalLessons = module.lessons?.length ?? 0;
    const completed = false;

    return (
        <Box sx={{ background: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(25,28,30,0.06)" }}>

            {/* Header */}
            <Box
                onClick={() => setOpen(o => !o)}
                sx={{
                    p: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "background 0.2s",
                    "&:hover": { background: "#f2f4f6" },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
                        background: open ? "linear-gradient(135deg, #1a146b, #312e81)" : "#eceef0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: open ? "white" : "#505f76" }}>
                            {String(module.order ?? index + 1).padStart(2, "0")}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: "#191c1e", fontSize: 15 }}>{module.title}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#777682", mt: 0.25 }}>
                            {totalLessons} Lesson{totalLessons !== 1 ? "s" : ""}
                        </Typography>
                    </Box>
                </Box>
                {open ? <ExpandLessIcon sx={{ color: "#505f76", fontSize: 20 }} /> : <ExpandMoreIcon sx={{ color: "#505f76", fontSize: 20 }} />}
            </Box>

            {/* Lessons */}
            {open && (
                <Box sx={{ px: 3, pb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
                    {module.lessons?.map((lesson, li) => {
                        return (
                            <Box
                                component={RouterLink}
                                to={isEnrolled && `/lessons/${lesson?._id}`}
                                key={lesson._id}
                                sx={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    p: "12px 16px", borderRadius: "8px",
                                    background: completed ? "rgba(68,181,168,0.06)" : isEnrolled ? "#f7f9fb" : "transparent",
                                    cursor: isEnrolled ? "pointer" : "default",
                                    transition: "background 0.2s",
                                    "&:hover": isEnrolled ? { background: "#eceef0" } : {},
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    {completed
                                        ? <CheckCircleIcon sx={{ fontSize: 16, color: "#44b5a8" }} />
                                        : isEnrolled
                                            ? <PlayCircleFilledIcon sx={{ fontSize: 16, color: "#44b5a8" }} />
                                            : <LockIcon sx={{ fontSize: 14, color: "#c8c5d3" }} />}
                                    <Typography sx={{ fontSize: 13, color: isEnrolled ? "#191c1e" : "#a0a0a8", fontWeight: isEnrolled ? 500 : 400 }}>
                                        {lesson.title}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default ModuleAccordion;