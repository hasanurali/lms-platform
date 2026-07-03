import { useState } from "react";

import { Box, Button, Pagination, Paper, Typography } from "@mui/material";

import { Add, VideoLibrary } from "@mui/icons-material";

import CreateCourse from "./CreateCourse";
import SummaryCard from "./SummaryCard";
import InstructorCourseCard from "./InstructorCourseCard"
import DeleteConfirmDialog from "./DeleteConfirmDialog"
import { INSTRUCTOR_COURSES_PER_PAGE } from "../constants/dashboardConstants"


const MOCK_COURSES = [
    {
        _id: "c1", title: "Introduction to JavaScript",
        description: "Learn JavaScript from basics to advanced concepts including closures, promises, and async/await.",
        price: 49.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-4RyxXWB8IUCic-qoLQ4EWgkpQP7vaIAHtj06pZI3LZ8vD2OcC8zeKsS6y37-_EN6kfozKSivVsPCvKQuKoM5upcvmPDCpOa-GsOga-g56nl6Of62X2qf0Mq1oJsndVd5BK1zVORBLT3k4Xv-k9J7pijQN95gpviYSlnLR10ZubsVZMg7tqqglLKuD3GM-SzPMLbvrsij032WrK8B8ltinjArQY70neME6vpo2bj5Sdj4SUBzoBff10ChjoIH-_QZDIiCRcvI4gc",
        isPublished: true, averageRating: 4.5, totalReviews: 120, totalEnrolled: 340, totalLessons: 24,
    },
    {
        _id: "c2", title: "Advanced CSS & Tailwind",
        description: "Master modern CSS techniques and Tailwind CSS v4 from scratch.",
        price: 39.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuArxY19W-3x56GfLe5VNlSw-5vv4D9YgsypdmoRrHrHTubg8nJ5w1_y2v0r48rhtcnZXVKa2ofn85riiSlmKC7a7pCvsvFyUZsKVCIiGJw_zqQtEIu2_bAKyxrWXBVDEAqZ4SsiXcg9QMB9cL3LLyCOFERatVyWjHXVF3EGEbIPWvj7M-HWw43CCWlg7ooTRG9nJC_nwz4wlp_c4mlK5Or_t4g6xxzK25NQ7-y09AGfjF_RaWf_B5W_XcZQoMMK_XEQjrOO8265Icw",
        isPublished: false, averageRating: 0, totalReviews: 0, totalEnrolled: 0, totalLessons: 18,
    },
    {
        _id: "c3", title: "Node.js & Express API Design",
        description: "Build production-grade REST APIs with Node.js, Express, and MongoDB.",
        price: 59.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBob8YhIicfO5okmxnHaGfM-VSpIAaHQbvEi-xefXYz3h5Ew33zYvgca-TYoDCKvo80kz5x399AiuJd8BqaEacli0QbBWIYiGuX3AKRFDtdCXIZcAFrNM8o7tex3Ll7si1bl9xRyGrAmf9p0wv4mSX0IhAZiA46WV4LafiMkGgPEI-rbxy8B1HuAmEiiovgBwE2oLvLFuk4EbHpEwl184QCVQXkcqeP1AaXFUIwUeYYm-3VYpnD-Iu98ZLhIL0Hh3rYNdRL3Y8olHs",
        isPublished: true, averageRating: 4.8, totalReviews: 210, totalEnrolled: 512, totalLessons: 32,
    },
    {
        _id: "c4", title: "MongoDB Aggregation Mastery",
        description: "Deep dive into MongoDB aggregation pipelines and query optimization.",
        price: 44.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzp81XCKxm1nig-ySw023PZPFV27R5OWpiQpCLNy0wSa1IqhN6ALLA977b09RBnhQurQQA1qD548_7Blce2yICNqhN6Wd4Pqt2cDiax0j1-5jyt3p3iFHdlCDmX82dofcnuQiau8I6Jh5NvUQW2HaxNDLsMqB30cfuSO1iSPJM_cLdKOPgxUcmsWnazDHRQ3QH2g_R5mB5wQOhjOtXsxa2twglOMM2L37kiCZuHKONl8ApM4RtNdMzd1sW9kGffklpaS3-tFqSRTQ",
        isPublished: false, averageRating: 0, totalReviews: 0, totalEnrolled: 0, totalLessons: 14,
    },
];

const InstructorCoursesTab = ({ courses = MOCK_COURSES }) => {
    const [page, setPage] = useState(1);
    const [createOpen, setCreateOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);
    const [deleteCourse, setDeleteCourse] = useState(null);

    const totalPages = Math.ceil(courses.length / INSTRUCTOR_COURSES_PER_PAGE);
    const paginated = courses.slice((page - 1) * INSTRUCTOR_COURSES_PER_PAGE, page * INSTRUCTOR_COURSES_PER_PAGE);

    if (createOpen) {
        return <CreateCourse onBack={() => setCreateOpen(false)} />;
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
                        {courses.length} courses · {courses.filter(c => c.isPublished).length} published
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}
                    sx={{ bgcolor: "#1a146b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "8px", px: 2.5, "&:hover": { bgcolor: "#312e81" } }}>
                    New Course
                </Button>
            </Box>

            {/* Summary row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <SummaryCard label="Published" count={courses.filter(c => c.isPublished).length} color="#16a34a" bgcolor="#f0fdf4" borderColor="#bbf7d0" />
                <SummaryCard label="Draft" count={courses.filter(c => !c.isPublished).length} color="#d97706" bgcolor="#fffbeb" borderColor="#fde68a" />
            </Box>

            {/* Course grid or empty */}
            {courses.length === 0 ? (
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
                    {paginated.map(course => (
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
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                        Showing {(page - 1) * INSTRUCTOR_COURSES_PER_PAGE + 1}–{Math.min(page * INSTRUCTOR_COURSES_PER_PAGE, courses.length)} of {courses.length}
                    </Typography>
                    <Pagination
                        count={totalPages} page={page}
                        onChange={(_, v) => setPage(v)} size="small"
                        sx={{ "& .MuiPaginationItem-root": { fontSize: "0.75rem", fontWeight: 600, color: "#475569", "&.Mui-selected": { bgcolor: "#1e1b6b", color: "#fff" } } }}
                    />
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