import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadNotifications } from "../services/notificationService";

const useMarkReadNotifications = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markReadNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
    });
};

export default useMarkReadNotifications;