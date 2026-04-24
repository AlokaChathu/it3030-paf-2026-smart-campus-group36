import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { buildAuthDataFromToken } from "../../utils/auth";

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      toast.error("Google login failed: token not found");
      navigate("/login", { replace: true });
      return;
    }

    const authData = buildAuthDataFromToken(token);

    if (!authData || !authData.role) {
      toast.error("Google login failed: invalid token data");
      navigate("/login", { replace: true });
      return;
    }

    login(authData);
    toast.success("Google login successful");

    if (authData.role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">OAuth Redirect</h1>
        <p className="mt-2 text-gray-600">Processing Google login...</p>
      </div>
    </div>
  );
};

export default OAuthRedirectPage;