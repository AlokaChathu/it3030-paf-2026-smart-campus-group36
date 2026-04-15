import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const features = [
  "Secure role-based access",
  "Google OAuth login",
  "Smart campus operations",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const loginData = response.data;

      login({
        token: loginData.token,
        userId: loginData.userId,
        email: loginData.email,
        role: loginData.role,
      });

      toast.success("Login successful");

      if (loginData.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 lg:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between px-8 py-10 xl:px-16 xl:py-14">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Return to Home
              </Link>
            </div>

            <div className="max-w-xl">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-white backdrop-blur-md">
                <Building2 size={28} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Smart Campus Hub
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Welcome back to your campus operations platform
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-300">
                Sign in to manage campus bookings, maintenance workflows,
                notifications, and role-based dashboards through one secure
                system.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {features.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Secure Authentication
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Login supports email/password authentication and Google OAuth
                    with role-based redirection after successful sign in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <div className="w-full max-w-md sm:max-w-lg">
            <div className="mb-6 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Return to Home
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 md:p-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  <Sparkles size={14} />
                  Welcome Back
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Enter your credentials to access your Smart Campus Hub
                  dashboard and continue your university workflows.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Continue with Google
              </button>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-slate-900 transition hover:text-blue-600 hover:underline"
                >
                  Create account
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;