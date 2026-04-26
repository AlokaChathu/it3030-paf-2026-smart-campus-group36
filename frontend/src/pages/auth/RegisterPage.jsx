import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Building2,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";

const roleOptions = [
  {
    value: "USER",
    label: "User",
    description: "Book resources and report incidents",
  },
  {
    value: "TECHNICIAN",
    label: "Technician",
    description: "Handle maintenance tasks and updates",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description: "Monitor and manage operational workflows",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Full administrative access and control",
  },
];

const highlights = [
  "Quick registration flow",
  "OTP verification support",
  "Role-based access setup",
];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const allowedRoles = roleOptions.map((role) => role.value);

    const nameRegex = /^[A-Za-z\s.'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

    if (!name) {
      toast.error("Full name is required");
      return false;
    }

    if (name.length < 3) {
      toast.error("Full name must be at least 3 characters");
      return false;
    }

    if (name.length > 60) {
      toast.error("Full name must not exceed 60 characters");
      return false;
    }

    if (!nameRegex.test(name)) {
      toast.error("Full name can only contain letters, spaces, dots, hyphens, and apostrophes");
      return false;
    }

    if (!email) {
      toast.error("Email address is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.includes(" ")) {
      toast.error("Password must not contain spaces");
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    if (!allowedRoles.includes(formData.role)) {
      toast.error("Please select a valid role");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post("/api/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      toast.success(response.data?.message || "Registration successful");

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`, {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Section */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 lg:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500 blur-3xl"></div>
          </div>

          <div className="relative flex w-full flex-col justify-between px-10 py-12 xl:px-16">
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
                Create your account and start using the campus operations
                platform
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-300">
                Register for secure access to bookings, incident reporting,
                maintenance workflows, and role-based campus operations.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {highlights.map((item) => (
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
                    Secure Onboarding
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    New users are registered with role selection and redirected
                    to OTP verification for account activation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <div className="w-full max-w-xl">
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Get Started
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Create your account
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Fill in your details to register for Smart Campus Hub and
                  continue to email verification.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <User size={18} className="text-slate-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Select Role
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <Briefcase size={18} className="text-slate-400" />
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Selected Role
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {
                      roleOptions.find((role) => role.value === formData.role)
                        ?.label
                    }
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {
                      roleOptions.find((role) => role.value === formData.role)
                        ?.description
                    }
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-slate-900 transition hover:text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;