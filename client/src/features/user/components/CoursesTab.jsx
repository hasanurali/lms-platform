import { useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";

import EnrolledCourseCard from "./EnrolledCourseCard";
import { COURSES_PER_PAGE } from "../constants/userConstants";

const CoursesTab = ({ courses }) => {
    const [page, setPage] = useState(1);

    const total = courses?.length;
    const totalPages = Math.ceil(total / COURSES_PER_PAGE);
    const paginated = courses?.slice((page - 1) * COURSES_PER_PAGE, page * COURSES_PER_PAGE);

    return (
        <Box className="space-y-6 max-w-4xl">

            {/* Header */}
            <Box className="flex justify-between items-center">
                <Box>
                    <Typography variant="h6" className="font-bold text-indigo-950 tracking-tight">
                        My Enrolled Courses
                    </Typography>
                    <Typography className="text-xs text-slate-400 mt-0.5">
                        {total} courses · {courses?.filter(c => c.progressPercentage === 100).length} completed
                    </Typography>
                </Box>
            </Box>

            {/* Overall progress summary */}
            <Box className="grid grid-cols-3 gap-4">
                {[
                    { label: "In Progress", count: courses?.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100).length, color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
                    { label: "Completed", count: courses?.filter(c => c.progressPercentage === 100).length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
                    { label: "Not Started", count: courses?.filter(c => c.progressPercentage === 0).length, color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
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
                    <EnrolledCourseCard key={course._id} course={course} />
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