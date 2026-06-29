import { Box, Paper, Typography } from '@mui/material';

import { EmojiEvents, OpenInNew } from '@mui/icons-material';

import RenderStars from "@/features/course/components/RenderStars";

const EnrolledCourseCard = ({ course, onOpen }) => {
    const isComplete = course.progressPercentage === 100;

    return (
        <Paper
            elevation={0}
            className="flex flex-col md:flex-row gap-0 overflow-hidden cursor-pointer group"
            sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 1,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                },
            }}
            onClick={() => onOpen(course)}>

            <Box sx={{ aspectRatio: "16/9" }} className="w-full md:w-44 h-36 md:h-auto shrink-0 relative overflow-hidden" sx={{ bgcolor: "grey.100" }}>
                <Box
                    component="img"
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    sx={{ display: "block" }}
                />
                {isComplete && (
                    <Box className="absolute inset-0 flex items-center justify-center" sx={{ bgcolor: "rgba(6, 78, 59, 0.5)" }}>
                        <EmojiEvents sx={{ fontSize: 32, color: "#fbbf24" }} />
                    </Box>
                )}
            </Box>

            <Box className="flex-1 flex flex-col justify-between p-5" sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box>
                    <Box component="span" className="text-xs mb-2 text-slate-400 whitespace-nowrap">
                        {course.progress.completedLessons.length}/{course.totalLessons} Lessons
                    </Box>
                    <Typography className="font-bold text-indigo-950 text-base mb-1 leading-snug group-hover:text-indigo-700 transition-colors">
                        {course.title}
                    </Typography>
                    <Typography className="text-slate-500 text-xs line-clamp-1 mb-2">
                        {course.description}
                    </Typography>
                    <Box className="flex items-center gap-3">
                        <RenderStars rating={course.averageRating} color="#FE9A00" />
                        <Box component="span" className="text-xs font-semibold text-amber-500">{course.averageRating}</Box>
                        <Box component="span" className="text-xs text-slate-400">({course.totalReviews} reviews)</Box>
                    </Box>
                </Box>

                <Box className="mt-4">
                    <Box className="w-full bg-slate-100 rounded-full h-2 mb-1.5 overflow-hidden" sx={{ bgcolor: "grey.100", borderRadius: 999, height: 8, overflow: "hidden" }}>
                        <Box
                            className={`h-2 rounded-full transition-all duration-500 ${isComplete ? "bg-green-500" : "bg-teal-500"}`}
                            style={{ width: `${course.progressPercentage}%` }}
                        />
                    </Box>
                    <Box className="flex justify-between items-center">
                        <Box component="span" className={`text-xs font-semibold ${isComplete ? "text-green-600" : "text-teal-600"}`}>
                            {isComplete ? "Completed!" : `${course.progressPercentage}% Complete`}
                        </Box>
                        <Box component="span" className="text-[10px] text-slate-400 flex items-center gap-1">
                            <OpenInNew sx={{ fontSize: 11 }} /> Continue
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default EnrolledCourseCard;