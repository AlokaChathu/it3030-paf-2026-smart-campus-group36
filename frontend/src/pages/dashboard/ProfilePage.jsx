import { useEffect, useRef, useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

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

  return (
    <DashboardLayout title="Profile">
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          Loading profile...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="mt-2 break-all font-semibold text-gray-900">
                {profile?.id || auth?.userId || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-2 break-all font-semibold text-gray-900">
                {profile?.email || auth?.email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Role</p>
              <p className="mt-2 font-semibold text-gray-900">
                {profile?.role || auth?.role || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Provider</p>
              <p className="mt-2 font-semibold text-gray-900">
                {profile?.provider || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Email Verification</p>
              <p className="mt-2 font-semibold text-gray-900">
                {profile?.emailVerified === true
                  ? "Verified"
                  : profile?.emailVerified === false
                  ? "Not Verified"
                  : "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Token Status</p>
              <p className="mt-2 font-semibold text-gray-900">
                {auth?.token ? "Stored successfully" : "Missing"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Update Profile</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your personal information.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="text"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">JWT Token</p>
            <p className="mt-2 break-all text-sm font-medium text-gray-900">
              {auth?.token || "-"}
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;