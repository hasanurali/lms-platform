import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";

import { DragIndicator, PlayCircleOutlineOutlined } from "@mui/icons-material";

const LessonRow = ({ lesson, order }) => {
    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2, py: 1.5, borderRadius: "10px", bgcolor: "#f8fafc",
            "&:hover": { bgcolor: "#f1f5f9" },
            "&:hover .lesson-actions": { opacity: 1 },
            transition: "background 0.15s",
        }}>
            <DragIndicator sx={{ fontSize: 15, color: "#cbd5e1", cursor: "grab", flexShrink: 0 }} />
            <PlayCircleOutlineOutlined sx={{ fontSize: 15, color: "#0d9488", flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }} noWrap>
                    Lesson {order} · {lesson.title}
                </Typography>
            </Box>
            {lesson.hasVideo && (
                <Chip label="Video" size="small"
                    sx={{ height: 18, fontSize: 9, fontWeight: 700, bgcolor: "#e0e7ff", color: "#1a146b", letterSpacing: "0.04em" }} />
            )}
            <Box className="lesson-actions" sx={{ display: "flex", gap: 0.5, opacity: 0, transition: "opacity 0.15s" }}>
                <Tooltip title="Edit">
                    <Button size="small" sx={{ minWidth: 0, px: 1.2, py: 0.3, fontSize: 10, fontWeight: 600, color: "#1a146b", bgcolor: "#e0e7ff", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#c7d2fe" } }}>
                        Edit
                    </Button>
                </Tooltip>
                <Tooltip title="Delete">
                    <Button size="small" sx={{ minWidth: 0, px: 1.2, py: 0.3, fontSize: 10, fontWeight: 600, color: "#dc2626", bgcolor: "#fee2e2", borderRadius: "6px", textTransform: "none", "&:hover": { bgcolor: "#fecaca" } }}>
                        Delete
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    );
}

export default LessonRow;