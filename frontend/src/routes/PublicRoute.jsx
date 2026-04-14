import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (auth?.token) {
    if (auth.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;