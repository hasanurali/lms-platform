import { useQueries } from '@tanstack/react-query';
import { fetchProgress } from "../services/progressService"

const useAllCoursesProgress = (courses = []) => {

    return useQueries({
        queries: courses.map((course) => ({
            queryKey: ['courseProgress', course.course?._id],
            queryFn: () => fetchProgress(course.course?._id),
            enabled: !!course.course?._id,
        })),
    });
};

export default useAllCoursesProgress;