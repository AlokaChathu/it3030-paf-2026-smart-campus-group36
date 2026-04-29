import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  // Wait until auth loading finishes
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Always allow access to public pages (login, register, etc.)
  return children;
};

export default PublicRoute;