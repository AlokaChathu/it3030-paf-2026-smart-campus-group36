import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ticketApi } from "../../api/ticketApi";
import { userApi } from "../../api/userApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const TicketsListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("my"); // my, assigned, all, analytics
  
  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7days");
  const [ticketTrends, setTicketTrends] = useState([]);
  const [technicianRatings, setTechnicianRatings] = useState([]);
  const [technicianNames, setTechnicianNames] = useState({});

  useEffect(() => {
    if (filter === "analytics") {
      fetchAnalytics();
    } else {
      fetchTickets();
    }
  }, [filter, timeRange]);

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

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const [trends, ratings] = await Promise.all([
        ticketApi.getTicketTrends(timeRange),
        ticketApi.getTechnicianRatings(timeRange),
      ]);
      setTicketTrends(trends);
      setTechnicianRatings(ratings);
      
      // Fetch technician names for the ratings
      const technicianIds = [...new Set(ratings.map(r => r.technicianId))];
      const nameMap = {};
      for (const techId of technicianIds) {
        try {
          const user = await userApi.getUserById(techId);
          nameMap[techId] = user.fullName;
        } catch (err) {
          console.error(`Failed to fetch user ${techId}:`, err);
        }
      }
      setTechnicianNames(nameMap);
      
      setError(null);
    } catch (err) {
      setError("Failed to load analytics. Please try again.");
      console.error(err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const auth = JSON.parse(localStorage.getItem("smart-campus-auth") || "{}");
  const userRole = auth?.role || "USER";
  const userId = auth?.userId;

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
              <>
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
                <button
                  onClick={() => setFilter("analytics")}
                  className={`${
                    filter === "analytics"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Analytics
                </button>
              </>
            )}
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Analytics View */}
        {filter === "analytics" && (
          <div>
            {/* Time Range Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {analyticsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Ticket Trends Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Tickets Created Over Time
                  </h2>
                  {ticketTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={ticketTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#4F46E5"
                          strokeWidth={2}
                          name="Tickets"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No trend data available for the selected time range.
                    </p>
                  )}
                </div>

                {/* Technician Ratings Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Technician Ratings
                  </h2>
                  {technicianRatings.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={technicianRatings.map(r => ({
                          ...r,
                          technicianName: technicianNames[r.technicianId] || r.technicianName
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="technicianName" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="averageRating"
                          fill="#4F46E5"
                          name="Average Rating"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No rating data available for the selected time range.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tickets List View */}
        {filter !== "analytics" && (
          <>
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
                      <div className="flex items-center space-x-3">
                        {/* Rating Display */}
                        {ticket.rating && (userId === ticket.createdBy || userRole === "ADMIN") && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400 text-sm">
                              {"★".repeat(ticket.rating)}
                              {"☆".repeat(5 - ticket.rating)}
                            </span>
                          </div>
                        )}
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TicketsListPage;
