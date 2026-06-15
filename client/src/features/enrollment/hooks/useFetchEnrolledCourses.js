import { useQuery } from "@tanstack/react-query";
import { fetchEnrolledCourses } from "../services/enrollmentService";

const useFetchEnrolledCourses = () => {
    return useQuery({
        queryKey: ["enrollments"],
        queryFn: fetchEnrolledCourses,
    });
};

export default useFetchEnrolledCourses;