import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllReadNotifications } from "../services/notificationService";

const useMarkAllReadNotifications = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markAllReadNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
    });
};

export default useMarkAllReadNotifications;