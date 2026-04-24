import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cancelBooking, getMyBookings } from "../../services/bookingService";

const statusClasses = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setActionId(id);
      const response = await cancelBooking(id);
      toast.success(response?.message || "Booking cancelled");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionId(null);
    }
  };

  const groupedByDate = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      const key = new Date(booking.startTime).toLocaleDateString();
      acc[key] = [...(acc[key] || []), booking];
      return acc;
    }, {});
  }, [bookings]);

  return (
    <DashboardLayout title="My Bookings">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Booking History Timeline</h2>
        <p className="mt-1 text-sm text-gray-600">
          Track all your requests from pending to final decision.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, items]) => (
              <div key={date}>
                <p className="mb-3 text-sm font-semibold text-gray-600">{date}</p>
                <div className="space-y-3">
                  {items.map((booking) => (
                    <div key={booking.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Resource #{booking.resourceId}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">{booking.purpose}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[booking.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Start: {new Date(booking.startTime).toLocaleString()}</span>
                        <span>End: {new Date(booking.endTime).toLocaleString()}</span>
                        <span>Attendees: {booking.attendees}</span>
                      </div>

                      {booking.rejectionReason && (
                        <p className="mt-2 text-xs text-red-600">
                          Rejection Reason: {booking.rejectionReason}
                        </p>
                      )}

                      {booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={actionId === booking.id}
                          className="mt-3 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                          {actionId === booking.id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  ))}
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
