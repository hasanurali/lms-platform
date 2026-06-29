import { useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";

import EnrolledCourseCard from "./EnrolledCourseCard";
import CourseDetailView from "./CourseDetailView";
import { COURSES_PER_PAGE } from "../constants/userConstants";


const MOCK_COURSES = [
    {
        _id: "c1",
        title: "Principles of Editorial Typography",
        description: "Mastering the art of vertical rhythm and grid systems in modern layouts.",
        instructor: "Prof. Elena Vance",
        price: 49.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-4RyxXWB8IUCic-qoLQ4EWgkpQP7vaIAHtj06pZI3LZ8vD2OcC8zeKsS6y37-_EN6kfozKSivVsPCvKQuKoM5upcvmPDCpOa-GsOga-g56nl6Of62X2qf0Mq1oJsndVd5BK1zVORBLT3k4Xv-k9J7pijQN95gpviYSlnLR10ZubsVZMg7tqqglLKuD3GM-SzPMLbvrsij032WrK8B8ltinjArQY70neME6vpo2bj5Sdj4SUBzoBff10ChjoIH-_QZDIiCRcvI4gc",
        isPublished: true,
        averageRating: 4.5,
        totalReviews: 120,
        category: "Visual Arts",
        totalLessons: 12,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"], completed: false },
        progressPercentage: 65,
    },
    {
        _id: "c2",
        title: "Sustainable Urban Development",
        description: "Exploring the intersection of green spaces and metropolitan growth.",
        instructor: "Dr. Marco Ricci",
        price: 69.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuArxY19W-3x56GfLe5VNlSw-5vv4D9YgsypdmoRrHrHTubg8nJ5w1_y2v0r48rhtcnZXVKa2ofn85riiSlmKC7a7pCvsvFyUZsKVCIiGJw_zqQtEIu2_bAKyxrWXBVDEAqZ4SsiXcg9QMB9cL3LLyCOFERatVyWjHXVF3EGEbIPWvj7M-HWw43CCWlg7ooTRG9nJC_nwz4wlp_c4mlK5Or_t4g6xxzK25NQ7-y09AGfjF_RaWf_B5W_XcZQoMMK_XEQjrOO8265Icw",
        isPublished: true,
        averageRating: 4.2,
        totalReviews: 85,
        category: "Architecture",
        totalLessons: 10,
        progress: { completedLessons: ["l1", "l2"], completed: false },
        progressPercentage: 20,
    },
    {
        _id: "c3",
        title: "Advanced Color Psychologies",
        description: "Deep Boxe into the psychology of color and its impact on design perception.",
        instructor: "Nina Okafor",
        price: 59.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBob8YhIicfO5okmxnHaGfM-VSpIAaHQbvEi-xefXYz3h5Ew33zYvgca-TYoDCKvo80kz5x399AiuJd8BqaEacli0QbBWIYiGuX3AKRFDtdCXIZcAFrNM8o7tex3Ll7si1bl9xRyGrAmf9p0wv4mSX0IhAZiA46WV4LafiMkGgPEI-rbxy8B1HuAmEiiovgBwE2oLvLFuk4EbHpEwl184QCVQXkcqeP1AaXFUIwUeYYm-3VYpnD-Iu98ZLhIL0Hh3rYNdRL3Y8olHs",
        isPublished: true,
        averageRating: 4.8,
        totalReviews: 210,
        category: "Design",
        totalLessons: 24,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5"], completed: false },
        progressPercentage: 21,
    },
    {
        _id: "c4",
        title: "Editorial Voice & Copywriting",
        description: "Craft a compelling editorial voice and master the art of persuasive copy.",
        instructor: "James Thornton",
        price: 39.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzp81XCKxm1nig-ySw023PZPFV27R5OWpiQpCLNy0wSa1IqhN6ALLA977b09RBnhQurQQA1qD548_7Blce2yICNqhN6Wd4Pqt2cDiax0j1-5jyt3p3iFHdlCDmX82dofcnuQiau8I6Jh5NvUQW2HaxNDLsMqB30cfuSO1iSPJM_cLdKOPgxUcmsWnazDHRQ3QH2g_R5mB5wQOhjOtXsxa2twglOMM2L37kiCZuHKONl8ApM4RtNdMzd1sW9kGffklpaS3-tFqSRTQ",
        isPublished: true,
        averageRating: 4.6,
        totalReviews: 150,
        category: "Writing",
        totalLessons: 12,
        progress: { completedLessons: [], completed: false },
        progressPercentage: 0,
    },
    {
        _id: "c5",
        title: "Grid Systems in Modern Design",
        description: "Master foundational grid systems that underpin every great editorial layout.",
        instructor: "Prof. Elena Vance",
        price: 44.99,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-4RyxXWB8IUCic-qoLQ4EWgkpQP7vaIAHtj06pZI3LZ8vD2OcC8zeKsS6y37-_EN6kfozKSivVsPCvKQuKoM5upcvmPDCpOa-GsOga-g56nl6Of62X2qf0Mq1oJsndVd5BK1zVORBLT3k4Xv-k9J7pijQN95gpviYSlnLR10ZubsVZMg7tqqglLKuD3GM-SzPMLbvrsij032WrK8B8ltinjArQY70neME6vpo2bj5Sdj4SUBzoBff10ChjoIH-_QZDIiCRcvI4gc",
        isPublished: true,
        averageRating: 4.3,
        totalReviews: 98,
        category: "Visual Arts",
        totalLessons: 18,
        progress: { completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "l13", "l14", "l15", "l16", "l17", "l18"], completed: true },
        progressPercentage: 100,
    },
];

const CoursesTab = () => {
    const [page, setPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const total = MOCK_COURSES.length;
    const totalPages = Math.ceil(total / COURSES_PER_PAGE);
    const paginated = MOCK_COURSES.slice((page - 1) * COURSES_PER_PAGE, page * COURSES_PER_PAGE);

    if (selectedCourse) {
        return <CourseDetailView course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
    }

    return (
        <Box className="space-y-6 max-w-4xl">

            {/* Header */}
            <Box className="flex justify-between items-center">
                <Box>
                    <Typography variant="h6" className="font-bold text-indigo-950 tracking-tight">
                        My Enrolled Courses
                    </Typography>
                    <Typography className="text-xs text-slate-400 mt-0.5">
                        {total} courses · {MOCK_COURSES.filter(c => c.progressPercentage === 100).length} completed
                    </Typography>
                </Box>
            </Box>

            {/* Overall progress summary */}
            <Box className="grid grid-cols-3 gap-4">
                {[
                    { label: "In Progress", count: MOCK_COURSES.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100).length, color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
                    { label: "Completed", count: MOCK_COURSES.filter(c => c.progressPercentage === 100).length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
                    { label: "Not Started", count: MOCK_COURSES.filter(c => c.progressPercentage === 0).length, color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
                ].map(({ label, count, color, bg }) => (
                    <Box key={label} className={`${bg} border rounded-xl p-4 text-center`}>
                        <span className={`text-2xl font-bold block ${color}`}>{count}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
                    </Box>
                ))}
            </Box>

            {/* Course list */}
            <Box className="space-y-4">
                {paginated.map((course) => (
                    <EnrolledCourseCard key={course._id} course={course} onOpen={setSelectedCourse} />
                ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box className="flex justify-between items-center pt-2">
                    <Typography className="text-xs text-slate-400">
                        Showing {(page - 1) * COURSES_PER_PAGE + 1}–{Math.min(page * COURSES_PER_PAGE, total)} of {total} courses
                    </Typography>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="small"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#475569",
                                "&.Mui-selected": {
                                    backgroundColor: "#1e1b6b",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#312e81" },
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default CoursesTab;