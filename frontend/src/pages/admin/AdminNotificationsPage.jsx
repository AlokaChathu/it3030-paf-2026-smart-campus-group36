import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axios";

const AdminNotificationsPage = () => {
  const hasFetched = useRef(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/admin/notifications");
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch admin notifications error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load admin notifications"
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);

      const response = await axiosInstance.delete(
        `/api/admin/notifications/${id}`
      );

      toast.success(response.data?.message || "Notification deleted");
      await fetchNotifications();
    } catch (error) {
      console.error("Delete admin notification error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete notification"
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout title="Admin Notifications">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {notifications.filter((item) => !(item.read || item.isRead)).length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Read Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {notifications.filter((item) => item.read || item.isRead).length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Admin can view and delete all system notifications.
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No notifications found.
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-5 ${
                    notification.read || notification.isRead
                      ? "border-gray-200 bg-white"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                          {notification.eventType || "SYSTEM"}
                        </span>

                        {!(notification.read || notification.isRead) && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-medium leading-6 text-gray-900">
                        {notification.message || "-"}
                      </p>

                      <p className="mt-3 text-xs text-gray-500">
                        User ID: {notification.userId || "-"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Created At: {notification.createdAt || "-"}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-400">
                        Notification ID: {notification.id || "-"}
                      </p>
                    </div>

                    <div className="flex w-full xl:w-auto">
                      <button
                        onClick={() => handleDelete(notification.id)}
                        disabled={actionId === notification.id}
                        className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 xl:w-auto"
                      >
                        {actionId === notification.id
                          ? "Processing..."
                          : "Delete Notification"}
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

export default AdminNotificationsPage;