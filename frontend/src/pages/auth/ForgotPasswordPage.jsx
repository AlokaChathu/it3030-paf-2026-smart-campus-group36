import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, KeyRound, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });

      toast.success(response.data?.message || "Password reset OTP sent");

      navigate(`/reset-password?email=${encodeURIComponent(email)}`, {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send password reset OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 lg:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between px-8 py-10 xl:px-16 xl:py-14">
            <div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>

            <div className="max-w-xl">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-white backdrop-blur-md">
                <KeyRound size={28} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Password Recovery
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Reset your password securely
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-300">
                Enter your email address to receive a password reset OTP and
                continue restoring access to your Smart Campus Hub account.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Secure Recovery Flow
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    A reset OTP is sent to your email so you can safely verify
                    your identity and create a new password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <div className="w-full max-w-md sm:max-w-lg">
            <div className="mb-6 lg:hidden">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 md:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Forgot Password
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Recover your account
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Enter your email to receive a password reset OTP.
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Sending OTP..." : "Send Reset OTP"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-semibold text-slate-900 transition hover:text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;