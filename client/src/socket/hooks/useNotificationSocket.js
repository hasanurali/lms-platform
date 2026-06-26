import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useSocketStore from "@/store/socketStore";
import { SOCKET_EVENTS } from "../event";

const useNotificationSocket = () => {

    const socket = useSocketStore(state => state.socket);
    const queryClient = useQueryClient();

    useEffect(() => {

        if (!socket) return;

        const handleNewNotification = () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        };

        // Invalidate query when new notification was send for auto refresh
        socket.on(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);

        return () => {
            socket.off(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);
        };

    }, [socket, queryClient]);
};

export default useNotificationSocket;