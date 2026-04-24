import axiosInstance from "../api/axios";

export const createBooking = async (payload) => {
  const response = await axiosInstance.post("/api/bookings", payload);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get("/api/bookings/my");
  return response.data;
};

export const getAllBookings = async (filters = {}) => {
  const response = await axiosInstance.get("/api/bookings", { params: filters });
  return response.data;
};

export const getApprovedSlots = async (resourceId, date) => {
  const response = await axiosInstance.get("/api/bookings/availability", {
    params: { resourceId, date },
  });
  return response.data;
};

export const updateBookingStatus = async (id, payload) => {
  const response = await axiosInstance.put(`/api/bookings/${id}/status`, payload);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axiosInstance.delete(`/api/bookings/${id}`);
  return response.data;
};
