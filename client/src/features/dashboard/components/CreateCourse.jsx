import { useState } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";

import { Add, ArrowBack } from "@mui/icons-material";

import CourseDetailsPanel from "./CourseDetailsPanel";
import CurriculumPanel from "./CurriculumPanel";

export default function CreateCourse({ onBack }) {
    const [courseId, setCourseId] = useState(null);

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>

            {/* Back and title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                <IconButton size="small" onClick={onBack}
                    sx={{ bgcolor: "white", border: "1px solid #e2e8f0", "&:hover": { bgcolor: "#f8fafc" } }}>
                    <ArrowBack sx={{ fontSize: 18, color: "#1a146b" }} />
                </IconButton>
                <Box>
                    <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700, color: "#1a146b", lineHeight: 1.2 }}>
                        Create New Course
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>
                        {courseId ? "Step 2 — Add modules and lessons" : "Step 1 — Fill in course details"}
                    </Typography>
                </Box>
                {courseId && (
                    <Chip label="Course Saved ✓" size="small"
                        sx={{ ml: "auto", bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700, fontSize: 10 }} />
                )}
            </Box>

            {/* Two-column layout */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 3fr" }, gap: 3, alignItems: "start" }}>

                {/* Left — Course Details */}
                <Box sx={{ position: { lg: "sticky" }, top: { lg: 90 } }}>
                    <CourseDetailsPanel onSaved={(id) => setCourseId(id)} />
                </Box>

                {/* Right — Curriculum */}
                <CurriculumPanel courseId={courseId} />
            </Box>
        </Box>
    );
}