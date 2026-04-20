import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ticketApi } from "../../api/ticketApi";
import DashboardLayout from "../../components/DashboardLayout";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userRole = auth?.role || "USER";
  const userId = auth?.id;

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketApi.getTicketById(id);
      setTicket(data);
      setEditForm({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        location: data.location,
        contactDetails: data.contactDetails,
      });
      setError(null);
    } catch (err) {
      setError("Failed to load ticket. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await ticketApi.updateTicket(id, editForm);
      setIsEditing(false);
      fetchTicket();
    } catch (err) {
      setError("Failed to update ticket. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }
    try {
      await ticketApi.deleteTicket(id);
      navigate("/tickets");
    } catch (err) {
      setError("Failed to delete ticket. Please try again.");
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

  const canEdit = ticket && (ticket.createdBy === userId || userRole === "ADMIN");
  const canDelete = ticket && (ticket.createdBy === userId || userRole === "ADMIN");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !ticket) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Ticket not found"}
          </div>
          <Link
            to="/tickets"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Tickets
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/tickets"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Tickets
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                #{ticket.id.substring(0, 8)} •{" "}
                {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
                {new Date(ticket.createdAt).toLocaleTimeString()}
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

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="FACILITY">Facility</option>
                    <option value="NETWORK">Network</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Details
                </label>
                <input
                  type="text"
                  value={editForm.contactDetails}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactDetails: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-900">{ticket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Category
                    </h3>
                    <p className="text-gray-900">{ticket.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Priority
                    </h3>
                    <p className="text-gray-900">{ticket.priority}</p>
                  </div>
                </div>

                {ticket.resourceId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Resource ID
                    </h3>
                    <p className="text-gray-900">{ticket.resourceId}</p>
                  </div>
                )}

                {ticket.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Location
                    </h3>
                    <p className="text-gray-900">{ticket.location}</p>
                  </div>
                )}

                {ticket.contactDetails && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Contact Details
                    </h3>
                    <p className="text-gray-900">{ticket.contactDetails}</p>
                  </div>
                )}

                {ticket.assignedTo && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Assigned To
                    </h3>
                    <p className="text-gray-900">{ticket.assignedTo}</p>
                  </div>
                )}

                {ticket.rejectionReason && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Rejection Reason
                    </h3>
                    <p className="text-red-600">{ticket.rejectionReason}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <p>Last updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Edit Ticket
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete Ticket
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
