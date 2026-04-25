import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cancelBooking, getMyBookings } from "../../api/bookingApi";

const badgeClasses = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

const MyBookingsPage = () => {
  const hasFetched = useRef(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load your bookings.");
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

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setActionId(bookingId);
      await cancelBooking(bookingId);
      toast.success("Booking cancelled.");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout title="My Bookings">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Resource #{booking.resourceId}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{booking.purpose}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {new Date(booking.startTime).toLocaleString()} -{" "}
                      {new Date(booking.endTime).toLocaleString()}
                    </p>
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

                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionId === booking.id}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        {actionId === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
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

export default MyBookingsPage;
