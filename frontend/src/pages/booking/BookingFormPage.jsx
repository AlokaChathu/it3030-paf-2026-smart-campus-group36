import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createBooking, getApprovedSlots } from "../../services/bookingService";

const initialForm = {
  resourceId: "",
  startTime: "",
  endTime: "",
  purpose: "",
  attendees: 1,
};

const BookingFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const selectedDate = useMemo(() => {
    if (!form.startTime) return "";
    return form.startTime.slice(0, 10);
  }, [form.startTime]);

  useEffect(() => {
    const fetchUnavailable = async () => {
      if (!form.resourceId || !selectedDate) {
        setUnavailableSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        const data = await getApprovedSlots(Number(form.resourceId), selectedDate);
        const slots = Array.isArray(data?.data) ? data.data : [];
        setUnavailableSlots(slots);
      } catch {
        setUnavailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchUnavailable();
  }, [form.resourceId, selectedDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.resourceId || !form.startTime || !form.endTime || !form.purpose.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error("Start time must be before end time");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        resourceId: Number(form.resourceId),
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose.trim(),
        attendees: Number(form.attendees),
      };

      const response = await createBooking(payload);
      toast.success(response?.message || "Booking request submitted");
      setForm(initialForm);
      setUnavailableSlots([]);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create booking";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Booking">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Booking Request Form</h2>
          <p className="mt-1 text-sm text-gray-600">
            Submit a booking request for campus resources.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Resource ID *
              </label>
              <input
                type="number"
                min="1"
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                placeholder="e.g. 1001"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Attendees *
              </label>
              <input
                type="number"
                min="1"
                name="attendees"
                value={form.attendees}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Purpose *
              </label>
              <textarea
                rows={4}
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                placeholder="Describe the booking purpose"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">Unavailable Time Slots</h3>
          <p className="mt-1 text-sm text-gray-600">
            Approved slots for selected resource and date.
          </p>

          <div className="mt-4 space-y-3">
            {loadingSlots ? (
              <p className="text-sm text-gray-500">Checking slots...</p>
            ) : unavailableSlots.length === 0 ? (
              <p className="text-sm text-gray-500">No approved slots found.</p>
            ) : (
              unavailableSlots.map((slot) => (
                <div key={slot.id} className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">Resource {slot.resourceId}</p>
                  <p className="mt-1 text-sm text-red-800">
                    {new Date(slot.startTime).toLocaleString()} -{" "}
                    {new Date(slot.endTime).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingFormPage;
