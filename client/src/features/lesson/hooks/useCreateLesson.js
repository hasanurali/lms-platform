import { useMutation } from "@tanstack/react-query";
import { createLesson } from "../services/lessonService";

const useCreateLesson = () => {

    return useMutation({
        mutationFn: createLesson,
    });
};

export default useCreateLesson;