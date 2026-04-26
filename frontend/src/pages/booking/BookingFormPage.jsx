import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createBooking, getUnavailableSlots } from "../../api/bookingApi";

const initialState = {
  resourceId: "",
  startTime: "",
  endTime: "",
  purpose: "",
  attendees: 1,
};

const BookingFormPage = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const nowMin = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const endMin = formData.startTime || nowMin;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.resourceId || !formData.startTime || !formData.endTime || !formData.purpose) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        resourceId: Number(formData.resourceId),
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose.trim(),
        attendees: Number(formData.attendees),
      });

      toast.success("Booking request submitted successfully.");
      setFormData(initialState);
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to create booking.";

      if (status === 409) {
        toast.error(`Conflict: ${message}`);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadUnavailable = async () => {
    if (!formData.resourceId || !formData.startTime) {
      toast.error("Enter resource ID and start time date first.");
      return;
    }

    try {
      const date = formData.startTime.split("T")[0];
      const response = await getUnavailableSlots(Number(formData.resourceId), date);
      setUnavailableSlots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setUnavailableSlots([]);
      toast.error(error?.response?.data?.message || "Failed to load unavailable slots.");
    }
  };

  return (
    <DashboardLayout title="Create Booking Request">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Booking Form</h2>
        <p className="mt-1 text-sm text-gray-600">
          Submit a booking request. New requests are created with <strong>PENDING</strong> status.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Resource ID *</label>
            <input
              type="number"
              min="1"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              placeholder="e.g. 101"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={nowMin}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={endMin}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-800">Unavailable Approved Slots (Bonus)</p>
              <button
                type="button"
                onClick={handleLoadUnavailable}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Load Slots
              </button>
            </div>
            {unavailableSlots.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No slots loaded yet.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {unavailableSlots.map((slot, index) => (
                  <li key={`${slot.startTime}-${index}`}>
                    {new Date(slot.startTime).toLocaleString()} -{" "}
                    {new Date(slot.endTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Purpose *</label>
            <textarea
              rows={4}
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              placeholder="State why this booking is needed"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Attendees *</label>
            <input
              type="number"
              min="1"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BookingFormPage;
