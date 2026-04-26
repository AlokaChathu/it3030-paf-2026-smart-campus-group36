import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Shield,
  KeyRound,
  MapPin,
  Phone,
  CalendarDays,
  BadgeCheck,
  RefreshCw,
  IdCard,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const hasFetched = useRef(false);
  const { auth } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    age: "",
    phoneNumber: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/users/me");
      const userData = response.data || null;

      setProfile(userData);

      setFormData({
        fullName: userData?.fullName || userData?.name || "",
        address: userData?.address || "",
        age: userData?.age ?? "",
        phoneNumber: userData?.phoneNumber || "",
      });
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to load profile"
      );
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchProfile();
  }, []);

  const validateProfileForm = () => {
    const fullName = formData.fullName.trim();
    const address = formData.address.trim();
    const age = formData.age.toString().trim();
    const phoneNumber = formData.phoneNumber.trim();

    const fullNameRegex = /^[A-Za-z\s.'-]+$/;
    const phoneNumberRegex = /^0\d{9}$/;
    const numberOnlyRegex = /^\d+$/;

    if (!fullName) {
      toast.error("Full name is required");
      return false;
    }

    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters");
      return false;
    }

    if (fullName.length > 60) {
      toast.error("Full name must not exceed 60 characters");
      return false;
    }

    if (!fullNameRegex.test(fullName)) {
      toast.error(
        "Full name can only contain letters, spaces, dots, hyphens, and apostrophes"
      );
      return false;
    }

    if (!phoneNumber) {
      toast.error("Phone number is required");
      return false;
    }

    if (!numberOnlyRegex.test(phoneNumber)) {
      toast.error("Phone number must contain only numbers");
      return false;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits and start with 0");
      return false;
    }

    if (!age) {
      toast.error("Age is required");
      return false;
    }

    if (!numberOnlyRegex.test(age)) {
      toast.error("Age must contain only numbers");
      return false;
    }

    const ageNumber = Number(age);

    if (ageNumber < 16 || ageNumber > 100) {
      toast.error("Age must be between 16 and 100");
      return false;
    }

    if (!address) {
      toast.error("Address is required");
      return false;
    }

    if (address.length < 5) {
      toast.error("Address must be at least 5 characters");
      return false;
    }

    if (address.length > 120) {
      toast.error("Address must not exceed 120 characters");
      return false;
    }

    if (/^\d+$/.test(address)) {
      toast.error("Address cannot contain only numbers");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      setIsUpdating(true);

      const payload = {
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        age: formData.age === "" ? null : Number(formData.age),
        phoneNumber: formData.phoneNumber.trim(),
      };

      const response = await axiosInstance.put("/api/users/me", payload);

      toast.success(response.data?.message || "Profile updated successfully");
      await fetchProfile();
    } catch (error) {
      console.error("Update profile error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile";

      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const infoCards = [
    {
      label: "User ID",
      value: profile?.id || auth?.userId || "-",
      icon: IdCard,
    },
    {
      label: "Email",
      value: profile?.email || auth?.email || "-",
      icon: Mail,
    },
    {
      label: "Role",
      value: profile?.role || auth?.role || "-",
      icon: Shield,
    },
    {
      label: "Provider",
      value: profile?.provider || "-",
      icon: User,
    },
    {
      label: "Email Verification",
      value:
        profile?.emailVerified === true
          ? "Verified"
          : profile?.emailVerified === false
          ? "Not Verified"
          : "-",
      icon: BadgeCheck,
      tone:
        profile?.emailVerified === true
          ? "success"
          : profile?.emailVerified === false
          ? "warning"
          : "default",
    },
    {
      label: "Token Status",
      value: auth?.token ? "Stored successfully" : "Missing",
      icon: KeyRound,
      tone: auth?.token ? "success" : "warning",
    },
  ];

  const getToneClasses = (tone) => {
    switch (tone) {
      case "success":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "warning":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      default:
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6">
        {loading ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw size={16} className="animate-spin" />
              Loading profile...
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl">
              <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                    <User size={26} />
                  </div>

                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                    My Profile
                  </p>

                  <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                    {profile?.fullName || profile?.name || "User Profile"}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    View your account details and update your personal
                    information from one professional profile dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Current Role
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {profile?.role || auth?.role || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Account Status
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {profile?.emailVerified === true ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {infoCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-3 break-all text-sm font-semibold text-slate-900 sm:text-base">
                          {item.value}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                        <Icon size={20} />
                      </div>
                    </div>

                    {(item.label === "Email Verification" ||
                      item.label === "Token Status") && (
                      <div className="mt-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getToneClasses(
                            item.tone
                          )}`}
                        >
                          {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-semibold text-slate-900">
                  Update Profile
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Update your personal information.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <User size={18} className="text-slate-400" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <Phone size={18} className="text-slate-400" />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="age"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Age
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <CalendarDays size={18} className="text-slate-400" />
                      <input
                        id="age"
                        name="age"
                        type="text"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Address
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus-within:border-blue-600 focus-within:bg-white">
                      <MapPin size={18} className="text-slate-400" />
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <KeyRound size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">JWT Token</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Stored authentication token for current session
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="break-all text-sm font-medium text-slate-900">
                  {auth?.token || "-"}
                </p>
              </div>
            </div> */}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;