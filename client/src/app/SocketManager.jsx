import { useEffect } from "react";

import useAuthUser from "@/features/auth/hooks/useAuthUser";
import useSocketStore from "@/store/socketStore";

const SocketManager = () => {
    const socket = useSocketStore((state) => state.socket);
    const { data: user } = useAuthUser();

    useEffect(() => {
        if (!socket || !user) return;

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [socket, user]);

    return null;
};

export default SocketManager;