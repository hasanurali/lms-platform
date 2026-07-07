import { useState } from "react";

import { Box, Button, Pagination, Paper, Typography } from "@mui/material";

import { Add, VideoLibrary } from "@mui/icons-material";

import CreateCourse from "./CreateCourse";
import SummaryCard from "./SummaryCard";
import InstructorCourseCard from "./InstructorCourseCard"
import DeleteConfirmDialog from "./DeleteConfirmDialog"
import { INSTRUCTOR_COURSES_PER_PAGE } from "../constants/dashboardConstants"


const InstructorCoursesTab = ({ page, setPage, courses, publishedCount, pagination }) => {

    const [createOpen, setCreateOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);
    const [deleteCourse, setDeleteCourse] = useState(null);

    if (createOpen || editCourse) {
        return <CreateCourse onBack={() => { setCreateOpen(false); setEditCourse(null) }} course={editCourse} />;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 900 }}>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                    <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700, color: "#1a146b", letterSpacing: "-0.02em" }}>
                        My Courses
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.3 }}>
                        {pagination?.total} courses · {publishedCount} published
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}
                    sx={{ bgcolor: "#1a146b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "8px", px: 2.5, "&:hover": { bgcolor: "#312e81" } }}>
                    New Course
                </Button>
            </Box>

            {/* Summary row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <SummaryCard label="Published" count={publishedCount} color="#16a34a" bgcolor="#f0fdf4" borderColor="#bbf7d0" />
                <SummaryCard label="Draft" count={pagination?.total - publishedCount} color="#d97706" bgcolor="#fffbeb" borderColor="#fde68a" />
            </Box>

            {/* Course grid or empty */}
            {courses?.length === 0 ? (
                <Paper elevation={0} sx={{
                    bgcolor: "white", borderRadius: "14px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    py: 10, px: 4, textAlign: "center",
                }}>
                    <VideoLibrary sx={{ fontSize: 40, color: "#e2e8f0", mb: 1.5 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1a146b", mb: 0.5 }}>No courses yet</Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 3 }}>Create your first course to get started.</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}
                        sx={{ bgcolor: "#1a146b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", borderRadius: "8px", "&:hover": { bgcolor: "#312e81" } }}>
                        Create Course
                    </Button>
                </Paper>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2.5 }}>
                    {courses?.map(course => (
                        <InstructorCourseCard
                            key={course._id}
                            course={course}
                            onEdit={setEditCourse}
                            onDelete={setDeleteCourse}
                        />
                    ))}
                </Box>
            )}

            {/* Pagination */}
            {pagination?.pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                        Showing {(page - 1) * INSTRUCTOR_COURSES_PER_PAGE + 1}–{Math.min(page * INSTRUCTOR_COURSES_PER_PAGE, pagination?.total)} of {pagination?.total}
                    </Typography>
                    <Pagination
                        count={pagination?.pages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                            justifyItems: "center",
                            paddingTop: "30px"
                        }} />
                </Box>
            )}

            {/* Delete dialog */}
            <DeleteConfirmDialog
                open={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                course={deleteCourse}
            />
        </Box>
    );
}

export default InstructorCoursesTab;