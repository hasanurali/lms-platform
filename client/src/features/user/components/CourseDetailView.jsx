import { Box, Button, Paper, Typography } from "@mui/material";

import { ChevronLeft, EmojiEvents, Videocam } from "@mui/icons-material";

import RenderStars from "@/features/course/components/RenderStars"

const CourseDetailView = ({ course, onBack }) => {
  const isComplete = course.progressPercentage === 100;

  return (
    <Box className="flex flex-col gap-6 max-w-4xl w-full mx-auto">

      {/* Back navigation */}
      <Box
        component="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-700 text-sm font-medium transition-colors"
      >
        <ChevronLeft fontSize="small" /> Back to Courses
      </Box>

      {/* Course banner */}
      <Paper elevation={0} className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
        <Box className="relative h-52 md:h-64 w-full overflow-hidden">
          <Box component="img" src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <Box className="absolute inset-0 bg-linear-to-t from-indigo-950/80 to-transparent flex items-end p-6">
            <Box>
              <Box component="span" className="text-[10px] font-bold uppercase tracking-widest text-teal-300 block mb-1">
                {course.category}
              </Box>
              <Typography className="text-white font-extrabold text-xl tracking-tight leading-snug">
                {course.title}
              </Typography>
              <Typography className="text-indigo-200 text-sm mt-1">
                by {course.instructor}
              </Typography>
            </Box>
          </Box>
          {isComplete && (
            <Box className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
              <EmojiEvents sx={{ fontSize: 13 }} /> Completed
            </Box>
          )}
        </Box>

        {/* Course content */}
        <Box className="p-6 space-y-5 bg-white">
          <Typography className="text-slate-600 text-sm leading-relaxed">
            {course.description}
          </Typography>

          {/* Course details */}
          <Box className="flex flex-wrap gap-6">
            <Box className="flex items-center gap-1.5">
              <RenderStars rating={course.averageRating} color="#FE9A00" />
              <Box component="span" className="text-sm font-semibold text-amber-500">{course.averageRating}</Box>
              <Box component="span" className="text-xs text-slate-400">({course.totalReviews})</Box>
            </Box>
            <Box className="flex items-center gap-1.5 text-slate-500 text-sm">
              <Videocam sx={{ fontSize: 16, color: '#6366f1' }} />
              <Box component="span">{course.totalLessons} lessons</Box>
            </Box>
            <Box className="flex items-center gap-1.5 text-slate-500 text-sm">
              <EmojiEvents sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Box component="span">{course.progress.completedLessons.length} completed</Box>
            </Box>
          </Box>

          {/* Progress section */}
          <Box>
            <Box className="flex justify-between items-center mb-2">
              <Box component="span" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Your Progress
              </Box>
              <Box component="span" className={isComplete ? 'text-sm font-bold text-green-600' : 'text-sm font-bold text-teal-600'}>
                {course.progressPercentage}%
              </Box>
            </Box>
            <Box className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <Box
                className={isComplete ? 'h-3 rounded-full transition-all duration-700 bg-green-500' : 'h-3 rounded-full transition-all duration-700 bg-teal-500'}
                style={{ width: `${course.progressPercentage}%` }}
              />
            </Box>
            <Box className="flex justify-between mt-1.5">
              <Box component="span" className="text-[10px] text-slate-400">
                {course.progress.completedLessons.length} of {course.totalLessons} lessons done
              </Box>
              {!isComplete && (
                <Box component="span" className="text-[10px] text-slate-400">
                  {course.totalLessons - course.progress.completedLessons.length} remaining
                </Box>
              )}
            </Box>
          </Box>

          {/* Action button */}
          <Box className="flex gap-3 pt-2">
            <Button
              variant="contained"
              size="medium"
              startIcon={<Videocam fontSize="small" />}
              className="bg-indigo-900! text-white! font-bold! text-xs! uppercase! tracking-widest! rounded-lg! px-5!">
              {course.progressPercentage === 0 ? 'Start Course' : isComplete ? 'Review Course' : 'Continue Learning'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CourseDetailView;