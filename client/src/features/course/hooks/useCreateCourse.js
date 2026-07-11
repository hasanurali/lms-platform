import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "../services/courseService";

const useCreateCourse = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-courses"] })
        }
    });
};

export default useCreateCourse;