import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllBookings, updateBookingStatus } from "../../services/bookingService";

const AdminBookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filters, setFilters] = useState({
    resourceId: "",
    date: "",
    status: "",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.resourceId) params.resourceId = Number(filters.resourceId);
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;

      const response = await getAllBookings(params);
      setBookings(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (bookingId, status) => {
    let rejectionReason = "";

    if (status === "REJECTED") {
      rejectionReason = window.prompt("Enter rejection reason:");
      if (!rejectionReason || !rejectionReason.trim()) {
        toast.error("Rejection reason is required");
        return;
      }
    }

    try {
      setActionId(bookingId);
      const response = await updateBookingStatus(bookingId, {
        status,
        rejectionReason,
      });
      toast.success(response?.message || "Booking status updated");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update booking");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout title="Admin Booking Management">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Booking Calendar View</h2>
        <p className="mt-1 text-sm text-gray-600">
          Filter by date/resource/status and approve or reject requests.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            type="number"
            name="resourceId"
            value={filters.resourceId}
            onChange={handleFilterChange}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Resource ID"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button
            onClick={fetchBookings}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Resource #{booking.resourceId} | User: {booking.userId}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">{booking.purpose}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(booking.startTime).toLocaleString()} -{" "}
                      {new Date(booking.endTime).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {booking.status}
                  </span>
                </div>

                {booking.status === "PENDING" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange(booking.id, "APPROVED")}
                      disabled={actionId === booking.id}
                      className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {actionId === booking.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, "REJECTED")}
                      disabled={actionId === booking.id}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {actionId === booking.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminBookingManagementPage;
