import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import NotFoundPage from "@/features/error/pages/NotFoundPage";

const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "verify-otp",
                element: <VerifyOtpPage />,
            }
        ]
    },
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            }
        ]
    },

    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [],
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;