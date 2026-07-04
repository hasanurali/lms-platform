import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Chip, Divider, IconButton, Menu, MenuItem, Paper, Rating, Typography } from "@mui/material";

import { Delete, Edit, MoreVert, VideoLibrary, Visibility, VisibilityOff } from "@mui/icons-material";

const InstructorCourseCard = ({ course, onEdit, onDelete }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);

    return (
        <Paper component={RouterLink} to={`/courses/${course?._id}`} elevation={0} sx={{
            bgcolor: "white", borderRadius: "14px", overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
        }}>

            {/* Thumbnail */}
            <Box sx={{ position: "relative", height: 144, width: "100%", overflow: "hidden" }}>
                <Box component="img" src={course.thumbnail} alt={course.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <Box sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(26,20,107,0.5) 0%, transparent 60%)",
                }} />

                {/* Publish badge */}
                <Chip
                    icon={course.isPublished
                        ? <Visibility sx={{ fontSize: "11px!important" }} />
                        : <VisibilityOff sx={{ fontSize: "11px!important" }} />
                    }
                    label={course.isPublished ? "Published" : "Draft"}
                    size="small"
                    sx={{
                        position: "absolute", top: 10, left: 10,
                        height: 22, fontSize: 9, fontWeight: 700,
                        letterSpacing: "0.05em",
                        bgcolor: course.isPublished ? "#059669" : "#f1f5f9",
                        color: course.isPublished ? "white" : "#475569",
                        "& .MuiChip-icon": { color: "inherit" },
                    }}
                />

                {/* 3-dot menu */}
                <Box onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} sx={{ position: "absolute", top: 6, right: 6 }}>
                    <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{ bgcolor: "rgba(255,255,255,0.92)", width: 28, height: 28, "&:hover": { bgcolor: "white" } }}>
                        <MoreVert sx={{ fontSize: 16, color: "#1a146b" }} />
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        PaperProps={{ elevation: 2, sx: { borderRadius: "10px", minWidth: 170, mt: 0.5 } }}
                    >

                        <MenuItem onClick={() => { onEdit(course); setMenuAnchor(null); }}
                            sx={{ fontSize: 13, gap: 1.5 }}>
                            <Edit sx={{ fontSize: 16, color: "#1a146b" }} /> Edit Course
                        </MenuItem>

                        {!course.isPublished && <MenuItem onClick={() => setMenuAnchor(null)} sx={{ fontSize: 13, gap: 1.5 }}>
                            <Visibility sx={{ fontSize: 16, color: "#16a34a" }} /> Publish
                        </MenuItem>}
                        <Divider sx={{ my: 0.5 }} />

                        <MenuItem onClick={() => { onDelete(course); setMenuAnchor(null); }}
                            sx={{ fontSize: 13, gap: 1.5, color: "#dc2626" }}>
                            <Delete sx={{ fontSize: 16 }} /> Delete Course
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* Card body */}
            <Box sx={{ p: 2.5 }}>
                <Typography sx={{
                    fontWeight: 700, fontSize: { xs: 13, sm: 14 },
                    color: "#1a146b", mb: 0.5, lineHeight: 1.3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {course.title}
                </Typography>
                <Typography sx={{
                    fontSize: 12, color: "#94a3b8", mb: 2,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {course.description}
                </Typography>

                {/* Rating row */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={course.averageRating} readOnly precision={0.5} size="small"
                        sx={{ fontSize: 14, color: "#f59e0b" }} />
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>({course.totalReviews})</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1a146b", ml: "auto" }}>
                        ${course.price}
                    </Typography>
                </Box>

            </Box>
        </Paper >
    );
}

export default InstructorCourseCard;