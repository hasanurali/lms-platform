import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishCourse } from "../services/courseService";

const usePublishCourse = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: publishCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-courses"] })
        }
    });
};

export default usePublishCourse;