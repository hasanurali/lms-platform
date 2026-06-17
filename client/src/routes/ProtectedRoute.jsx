import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "@/features/auth/hooks/useAuthUser";

const ProtectedRoute = () => {

    const { data: user, isLoading } = useAuthUser();

    if (isLoading) {
        return <div>Loading...</div>;
    };

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;