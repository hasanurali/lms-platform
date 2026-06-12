import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollCourse } from "../services/enrollmentService";

const useEnrollCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => enrollCourse(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
            queryClient.invalidateQueries({ queryKey: ["courses", id] });
        },
    });
};

export default useEnrollCourse;
