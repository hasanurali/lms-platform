import { Box, Typography } from '@mui/material';

const InstructorDoubtsCourseItem = ({ course, selected, onClick }) => {
    return (
        <Box onClick={onClick} sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2, py: 1.5, cursor: "pointer", borderRadius: "10px",
            bgcolor: selected ? "#eef2ff" : "transparent",
            border: selected ? "1px solid #c7d2fe" : "1px solid transparent",
            transition: "all 0.15s",
            "&:hover": { bgcolor: selected ? "#eef2ff" : "#f8fafc" },
        }}>

            <Box sx={{
                width: 44, height: 44, borderRadius: "8px",
                overflow: "hidden", flexShrink: 0,
                border: selected ? "2px solid #1a146b" : "2px solid transparent",
                transition: "border 0.15s",
            }}>

                <Box component="img" src={course.thumbnail} alt={course.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{
                    fontSize: 12, fontWeight: 700,
                    color: selected ? "#1a146b" : "#334155",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    lineHeight: 1.3,
                }}>
                    {course.title}
                </Typography>
            </Box>

        </Box>
    );
}

export default InstructorDoubtsCourseItem;