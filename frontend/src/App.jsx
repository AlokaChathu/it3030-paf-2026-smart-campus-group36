import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import NotFoundPage from "./pages/public/NotFoundPage";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OAuthRedirectPage from "./pages/auth/OAuthRedirectPage";

import UserDashboardPage from "./pages/dashboard/UserDashboardPage";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import BookingFormPage from "./pages/booking/BookingFormPage";
import MyBookingsPage from "./pages/booking/MyBookingsPage";
import AdminBookingManagementPage from "./pages/admin/AdminBookingManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtpPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "TECHNICIAN", "MANAGER"]}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["USER", "TECHNICIAN", "MANAGER", "ADMIN"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/notifications"
          element={
            <ProtectedRoute allowedRoles={["USER", "TECHNICIAN", "MANAGER"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/bookings/new"
          element={
            <ProtectedRoute allowedRoles={["USER", "TECHNICIAN", "MANAGER"]}>
              <BookingFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute allowedRoles={["USER", "TECHNICIAN", "MANAGER"]}>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminBookingManagementPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;