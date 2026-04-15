import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axios";

const NotificationsPage = () => {
  const hasFetched = useRef(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const logAxiosError = (label, error) => {
    console.error(label, {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      fullError: error,
    });
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const notificationsRes = await axiosInstance.get("/api/notifications");
      setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);

      try {
        const unreadRes = await axiosInstance.get("/api/notifications/unread-count");
        setUnreadCount(Number(unreadRes.data?.data ?? 0));
      } catch (error) {
        logAxiosError("Unread count API error:", error);
        setUnreadCount(0);

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Unread count request failed";

        toast.error(message);
      }
    } catch (error) {
      logAxiosError("Notifications API error:", error);
      setNotifications([]);
      setUnreadCount(0);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Notifications request failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoadingId(id);
      const response = await axiosInstance.put(`/api/notifications/${id}/read`);
      toast.success(response.data?.message || "Marked as read");
      await fetchNotifications();
    } catch (error) {
      logAxiosError("Mark as read error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to mark as read");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoadingId(id);
      const response = await axiosInstance.delete(`/api/notifications/${id}`);
      toast.success(response.data?.message || "Notification deleted");
      await fetchNotifications();
    } catch (error) {
      logAxiosError("Delete error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{notifications.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{unreadCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">My Notifications</h2>
          <p className="mt-1 text-sm text-gray-600">
            View, mark as read, and delete your notifications.
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
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
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

                      <p className="mt-3 text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>

                      <p className="mt-3 text-xs text-gray-500">
                        Created At: {notification.createdAt || "-"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!(notification.read || notification.isRead) && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={actionLoadingId === notification.id}
                          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                        >
                          {actionLoadingId === notification.id ? "Processing..." : "Mark as Read"}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        disabled={actionLoadingId === notification.id}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        {actionLoadingId === notification.id ? "Processing..." : "Delete"}
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

export default NotificationsPage;