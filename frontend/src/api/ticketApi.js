import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8090";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const ticketApi = {
  // Create a new ticket
  createTicket: async (ticketData) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/tickets`,
      ticketData,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get all tickets (ADMIN only)
  getAllTickets: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/tickets`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get current user's tickets
  getMyTickets: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/tickets/my`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get tickets assigned to current technician
  getAssignedTickets: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/tickets/assigned`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/tickets/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Update ticket
  updateTicket: async (id, ticketData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/tickets/${id}`,
      ticketData,
      getAuthHeaders()
    );
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (id, statusData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/tickets/${id}/status`,
      statusData,
      getAuthHeaders()
    );
    return response.data;
  },

  // Assign technician to ticket (ADMIN only)
  assignTechnician: async (id, technicianId) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/tickets/${id}/assign`,
      { technicianId },
      getAuthHeaders()
    );
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/api/tickets/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },
};
