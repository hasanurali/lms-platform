import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import CoursePage from "@/features/course/pages/CoursePage";
import CourseDetailsPage from "@/features/course/pages/CourseDetails";
import NotFoundPage from "@/features/error/pages/NotFoundPage";
import LessonVideoPlayer from "@/features/lesson/page/LessonVideoPlayer";
import Dashboard from "@/features/dashboard/pages/Dashboard";

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
            },
            {
                path: "courses",
                element: <CoursePage />,
            },
            {
                path: "courses/:id",
                element: <CourseDetailsPage />,
            },
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
                        element: <Dashboard />
                    }
                ],
            },
            {
                path: "/courses/:courseId/lessons/:lessonId",
                element: <LessonVideoPlayer />
            }
        ],
    },

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;