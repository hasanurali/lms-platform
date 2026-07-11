import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "../services/courseService";

const useUpdateCourse = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-courses"] })
        }
    });
};

export default useUpdateCourse;