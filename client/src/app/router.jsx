import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import NotFoundPage from "@/features/error/pages/NotFoundPage";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [
            {
                path: "auth",
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
        element: <ProtectedRoute />,
        children: [
            {
                path: "dashboard",
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <div>Dashboard page</div>
                    }
                ],
            },
        ]
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;