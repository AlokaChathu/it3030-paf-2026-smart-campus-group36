import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axios";

const ROLE_OPTIONS = ["USER", "TECHNICIAN", "MANAGER", "ADMIN"];

const AdminUsersPage = () => {
  const hasFetched = useRef(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/admin/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to load users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setActionUserId(userId);

      const response = await axiosInstance.put(`/api/admin/users/${userId}/role`, {
        role,
      });

      toast.success(response.data?.message || "Role updated successfully");
      await fetchUsers();
    } catch (error) {
      console.error("Update role error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to update role"
      );
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user account?"
    );

    if (!confirmed) return;

    try {
      setActionUserId(userId);

      const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
      toast.success(response.data?.message || "User deleted successfully");
      await fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to delete user"
      );
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {users.filter((user) => user.role === "ADMIN").length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Non-Admins</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {users.filter((user) => user.role !== "ADMIN").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <p className="mt-1 text-sm text-gray-600">
            View users, update roles, and delete accounts.
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-gray-900">
                        {user.name || user.fullName || "Unnamed User"}
                      </p>

                      <p className="mt-2 break-all text-sm text-gray-700">
                        Email: {user.email || "-"}
                      </p>

                      <p className="mt-1 break-all text-sm text-gray-700">
                        User ID: {user.id || "-"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                          {user.role || "NO_ROLE"}
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          Provider: {user.provider || "-"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.emailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Not Verified"}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:w-64">
                      <select
                        defaultValue={user.role || "USER"}
                        disabled={actionUserId === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 disabled:opacity-60"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionUserId === user.id}
                        className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
                      >
                        {actionUserId === user.id ? "Processing..." : "Delete User"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;