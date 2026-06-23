import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "@/features/auth/hooks/useAuthUser";
import { useEffect } from "react";
import useSocketStore from "@/store/socketStore"

const ProtectedRoute = () => {

    const socket = useSocketStore((state) => state.socket);

    const { data: user, isLoading } = useAuthUser();

    useEffect(() => {
        if (user && !socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, [user]);


    if (isLoading) {
        return <div>Loading...</div>;
    };

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;