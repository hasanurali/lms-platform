import { useState } from "react";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";

import { Add, ArrowBack } from "@mui/icons-material";

import CourseDetailsPanel from "./CourseDetailsPanel";
import CurriculumPanel from "./CurriculumPanel";
import usePublishCourse from "@/features/course/hooks/usePublishCourse"

export default function CreateCourse({ onBack, course }) {
    const [courseId, setCourseId] = useState(null);

    const { mutate: publishCourseMutate, isPending: isPublishCoursePending } = usePublishCourse()
    const handlePublishCourse = (id) => {
        if (!id) return;
        publishCourseMutate(id, {
            onSuccess: () => {
                onBack()
            }
        })
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>

            {/* Back and title */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2, mb: 4 }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <IconButton
                        size="small"
                        onClick={onBack}
                        sx={{
                            bgcolor: "white",
                            border: "1px solid #e2e8f0",
                            "&:hover": { bgcolor: "#f8fafc" }
                        }}>
                        <ArrowBack sx={{ fontSize: 18, color: "#1a146b" }} />
                    </IconButton>
                    <Box>
                        <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700, color: "#1a146b", lineHeight: 1.2 }}>
                            {course ? "Edit course" : "Create New Course"}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>
                            {course ?
                                (courseId ? "Step 2 — Add modules and lessons" : "Step 1 — Edit course details") :
                                (courseId ? "Step 2 — Add modules and lessons" : "Step 1 — Fill course details")
                            }
                        </Typography>
                    </Box>
                </Box>

                {/* Right panel action buttons */}
                {!course?.isPublished && <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>

                    {/* Save as Draft Button */}
                    <Button variant="outlined"
                        disabled={!courseId || !course?._id || isPublishCoursePending}
                        onClick={onBack}
                        sx={{
                            flex: { xs: 1, sm: 'initial' },
                            textTransform: 'none', fontWeight: 500,
                            borderRadius: '8px', padding: '6px 16px',
                            borderColor: '#312e81', color: '#312e81',
                            fontSize: '0.875rem', whiteSpace: 'nowrap',
                            '&:hover': {
                                borderColor: '#1e1b4b',
                                backgroundColor: 'rgba(49, 46, 129, 0.04)',
                            },
                            '&.Mui-disabled': {
                                borderColor: '#cbd5e1',
                                color: '#64748b',
                            },
                        }}>
                        Save as Draft
                    </Button>

                    {/* Publish Button */}
                    <Button variant="contained"
                        disabled={!courseId || !course?._id || isPublishCoursePending}
                        onClick={() => handlePublishCourse(courseId || course?._id)}
                        sx={{
                            flex: { xs: 1, sm: 'initial' },
                            textTransform: 'none', fontWeight: 500,
                            borderRadius: '8px', padding: '6px 20px',
                            backgroundColor: '#312e81', color: '#ffffff',
                            fontSize: '0.875rem', boxShadow: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                backgroundColor: '#1e1b4b',
                                boxShadow: 'none',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#cbd5e1',
                                color: '#64748b',
                            }
                        }}>
                        {isPublishCoursePending ? "Publishing..." : "Publish"}
                    </Button>
                </Box>}

            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 3fr" }, gap: 3, alignItems: "start" }}>

                {/* Left course details */}
                <Box sx={{ position: { lg: "sticky" }, top: { lg: 90 } }}>
                    <CourseDetailsPanel onSaved={setCourseId} course={course} />
                </Box>

                {/* Right curriculum */}
                <CurriculumPanel courseId={courseId} />
            </Box>
        </Box>
    );
}