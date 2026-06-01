import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "@/features/auth/hooks/useAuthUser";

const GuestRoute = () => {

    const { data: user, isLoading } = useAuthUser();

    if (isLoading) {
        return <div>Loading...</div>;
    };

    if (user) {
        return <Navigate to="/" replace />;
    };

    return <Outlet />;
};

export default GuestRoute;