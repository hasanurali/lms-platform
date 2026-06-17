import { useMutation } from "@tanstack/react-query";
import { markLessonComplete } from "../services/progressService";

const useMarkLessonComplete = () => {

    return useMutation({
        mutationFn: markLessonComplete
    });
};

export default useMarkLessonComplete;