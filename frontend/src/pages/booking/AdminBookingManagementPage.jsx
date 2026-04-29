import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllBookings, updateBookingStatus } from "../../api/bookingApi";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const badgeClasses = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

const AdminBookingManagementPage = () => {
  const hasFetched = useRef(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filters, setFilters] = useState({
    resourceId: "",
    date: "",
    status: "",
  });

  const fetchBookings = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilters.resourceId) params.resourceId = Number(activeFilters.resourceId);
      if (activeFilters.date) params.date = activeFilters.date;
      if (activeFilters.status) params.status = activeFilters.status;

      const response = await getAllBookings(params);
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchBookings();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    await fetchBookings(filters);
  };

  const resetFilters = async () => {
    const reset = { resourceId: "", date: "", status: "" };
    setFilters(reset);
    await fetchBookings(reset);
  };

  const handleApprove = async (bookingId) => {
    try {
      setActionId(bookingId);
      await updateBookingStatus(bookingId, { status: "APPROVED" });
      toast.success("Booking approved.");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason || !reason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    try {
      setActionId(bookingId);
      await updateBookingStatus(bookingId, {
        status: "REJECTED",
        rejectionReason: reason.trim(),
      });
      toast.success("Booking rejected.");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Rejection failed.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout title="Admin Booking Management">
      <form
        onSubmit={applyFilters}
        className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:grid-cols-4"
      >
        <input
          type="number"
          min="1"
          name="resourceId"
          value={filters.resourceId}
          onChange={handleFilterChange}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          placeholder="Resource ID"
        />

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found for selected filters.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Resource #{booking.resourceId}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">User ID: {booking.userId}</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(booking.startTime).toLocaleString()} -{" "}
                      {new Date(booking.endTime).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">Purpose: {booking.purpose}</p>
                    <p className="mt-1 text-sm text-gray-700">Attendees: {booking.attendees}</p>
                    {booking.rejectionReason && (
                      <p className="mt-2 text-sm text-red-700">
                        Rejection reason: {booking.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeClasses[booking.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          disabled={actionId === booking.id}
                          className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          disabled={actionId === booking.id}
                          className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminBookingManagementPage;
