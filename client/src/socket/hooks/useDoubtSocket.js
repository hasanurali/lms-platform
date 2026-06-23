import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useSocketStore from "@/store/socketStore";
import { SOCKET_EVENTS } from "../event";

const useDoubtSocket = ({ lessonId, doubtId }) => {

    const socket = useSocketStore(state => state.socket);
    const queryClient = useQueryClient();

    useEffect(() => {

        if (!doubtId) return;

        // Joining room with doubt id
        socket.emit(SOCKET_EVENTS.JOIN_DOUBT_ROOM, doubtId);

        // Invalidate query when new reply was send for auto refresh
        socket.on(SOCKET_EVENTS.NEW_DOUBT_REPLY, (data) => {

            queryClient.invalidateQueries({
                queryKey: ["doubts", doubtId],
            });

            queryClient.invalidateQueries({
                queryKey: ["lessons", lessonId, "doubts"],
            });
        });

        // Invalidate query when status was changed for auto refresh
        socket.on(SOCKET_EVENTS.DOUBT_STATUS_UPDATED, () => {
            queryClient.invalidateQueries({
                queryKey: ["doubts", doubtId],
            });

            queryClient.invalidateQueries({
                queryKey: ["lessons", lessonId, "doubts"],
            });
        });

        return () => {

            socket.emit(SOCKET_EVENTS.LEAVE_DOUBT_ROOM, doubtId);

            socket.off(SOCKET_EVENTS.NEW_DOUBT_REPLY);
            socket.off(SOCKET_EVENTS.DOUBT_STATUS_UPDATED);
        };

    }, [doubtId]);
};

export default useDoubtSocket;