import axiosInstance from "./axios";

export const createBooking = (payload) => axiosInstance.post("/api/bookings", payload);

export const getMyBookings = () => axiosInstance.get("/api/bookings/my");

export const cancelBooking = (bookingId) =>
  axiosInstance.delete(`/api/bookings/${bookingId}`);

export const getAllBookings = (filters = {}) =>
  axiosInstance.get("/api/bookings", { params: filters });

export const updateBookingStatus = (bookingId, payload) =>
  axiosInstance.put(`/api/bookings/${bookingId}/status`, payload);

export const getUnavailableSlots = (resourceId, date) =>
  axiosInstance.get("/api/bookings/unavailable", {
    params: { resourceId, date },
  });

/** Peak-hours analytics: campus-wide from APPROVED bookings. Pass days to limit window; omit/0 = all time. */
export const getPeakHoursAnalytics = (params = {}) =>
  axiosInstance.get("/api/bookings/analytics/peak-hours", { params });
