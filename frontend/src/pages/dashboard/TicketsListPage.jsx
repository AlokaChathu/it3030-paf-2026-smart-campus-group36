import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ticketApi } from "../../api/ticketApi";
import DashboardLayout from "../../components/DashboardLayout";

const TicketsListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("my"); // my, assigned, all

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === "my") {
        data = await ticketApi.getMyTickets();
      } else if (filter === "assigned") {
        data = await ticketApi.getAssignedTickets();
      } else {
        data = await ticketApi.getAllTickets();
      }
      setTickets(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "bg-green-100 text-green-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESOLVED: "bg-purple-100 text-purple-800",
      CLOSED: "bg-gray-100 text-gray-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }
    try {
      await ticketApi.deleteTicket(id);
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    } catch (err) {
      setError("Failed to delete ticket. Please try again.");
    }
  };

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userRole = auth?.role || "USER";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Incident Tickets</h1>
          <Link
            to="/tickets/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create New Ticket
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter("my")}
              className={`${
                filter === "my"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Tickets
            </button>
            {userRole === "TECHNICIAN" && (
              <button
                onClick={() => setFilter("assigned")}
                className={`${
                  filter === "assigned"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Assigned to Me
              </button>
            )}
            {userRole === "ADMIN" && (
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All Tickets
              </button>
            )}
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No tickets found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      #{ticket.id.substring(0, 8)} •{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Category:</span> {ticket.category}
                    {ticket.location && (
                      <span className="ml-4">
                        <span className="font-medium">Location:</span> {ticket.location}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
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

export default TicketsListPage;
