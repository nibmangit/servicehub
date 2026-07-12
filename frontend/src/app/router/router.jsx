import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import AuthLayout from "../../layouts/AuthLayout";
import DashboardLayout from "../../layouts/DashboardLayout";

import ProtectedRoute from "../../components/shared/ProtectedRoute";

import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import DashboardPage from "../../pages/DashboardPage";
import ServicesPage from "../../pages/ServicesPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ServiceDetailPage from "../../pages/ServiceDetailPage";
import RequestDetailPage from "../../pages/RequestDetailPage";
import RequestsPage from "../../pages/RequestsPage";
import IncomingRequestsPage from "../../pages/IncomingRequestsPage";
import ChatPage from "../../pages/ChatPage";
import NotificationsPage from "../../pages/NotificationsPage";
import ProfilePage from "../../pages/ProfilePage";
import ReviewsPage from "../../pages/ReviewsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "services",
                element: <ServicesPage />,
            },
            {
                path: "services/:id",
                element: <ServiceDetailPage />,
            },
            {
                path: "requests",
                element: <RequestsPage />
            }, 
            {
                path: "requests/:id",
                element: <RequestDetailPage />,
            },
            {
                path: "provider/requests",
                element: <IncomingRequestsPage />,
            },
            {
                path: "chat", 
                element: <ChatPage />
            },
            {
                path: "notifications", 
                element: <NotificationsPage />
            },
            {
                path: "providers/:id",
                element: <ProfilePage />
            },
            {
                path: "reviews", 
                element: <ReviewsPage />
            }
        ],
    },
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
        ],
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);