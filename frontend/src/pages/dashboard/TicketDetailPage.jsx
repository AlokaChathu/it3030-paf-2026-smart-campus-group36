import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ticketApi } from "../../api/ticketApi";
import { userApi } from "../../api/userApi";
import DashboardLayout from "../../components/layout/DashboardLayout";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const auth = JSON.parse(localStorage.getItem("smart-campus-auth") || "{}");
  const userRole = auth?.role || "USER";
  const userId = auth?.userId;

  useEffect(() => {
    fetchTicket();
    fetchAttachments();
    fetchComments();
    if (userRole === "ADMIN") {
      fetchTechnicians();
    }
  }, [id, userRole]);

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

  const fetchAttachments = async () => {
    try {
      const data = await ticketApi.getAttachments(id);
      setAttachments(data);
    } catch (err) {
      console.error("Failed to load attachments:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await ticketApi.getComments(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const data = await userApi.getUsersByRole("TECHNICIAN");
      setTechnicians(data);
    } catch (err) {
      console.error("Failed to load technicians:", err);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (attachments.length >= 3) {
      setError("Maximum of 3 attachments allowed per ticket");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        await ticketApi.uploadAttachment(id, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Data,
        });
        fetchAttachments();
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload attachment. Please try again.");
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm("Are you sure you want to delete this attachment?")) {
      return;
    }
    try {
      await ticketApi.deleteAttachment(id, attachmentId);
      fetchAttachments();
    } catch (err) {
      setError("Failed to delete attachment. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await ticketApi.addComment(id, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      await ticketApi.deleteComment(id, commentId);
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId) {
      setError("Please select a technician");
      return;
    }
    setAssigning(true);
    try {
      await ticketApi.assignTechnician(id, selectedTechnicianId);
      fetchTicket();
      setSelectedTechnicianId("");
      setError(null);
    } catch (err) {
      setError("Failed to assign technician. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      setError("Please select a status");
      return;
    }
    if (selectedStatus === "REJECTED" && !rejectionReason.trim()) {
      setError("Rejection reason is required when rejecting a ticket");
      return;
    }
    setUpdatingStatus(true);
    try {
      await ticketApi.updateTicketStatus(id, {
        status: selectedStatus,
        rejectionReason: rejectionReason || null,
      });
      fetchTicket();
      setSelectedStatus("");
      setRejectionReason("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(false);
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

              {/* Technician Assignment - Admin Only */}
              {userRole === "ADMIN" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Assign Technician
                  </h3>
                  <div className="flex space-x-4">
                    <select
                      value={selectedTechnicianId}
                      onChange={(e) => setSelectedTechnicianId(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a technician...</option>
                      {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {technician.fullName || technician.email} ({technician.email})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignTechnician}
                      disabled={assigning || !selectedTechnicianId}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {assigning ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select a technician from the dropdown to assign this ticket to them.
                  </p>
                </div>
              )}

              {/* Status Update - Technician or Admin */}
              {(userRole === "TECHNICIAN" || userRole === "ADMIN") && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Update Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select a status...</option>
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                        {userRole === "ADMIN" && <option value="REJECTED">REJECTED</option>}
                      </select>
                    </div>
                    {selectedStatus === "REJECTED" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                        />
                      </div>
                    )}
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updatingStatus || !selectedStatus}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {updatingStatus ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED (REJECTED by admin only)
                  </p>
                </div>
              )}

              {/* Attachments Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments ({attachments.length}/3)
                </h3>
                {attachments.length < 3 && (
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max 3 images, 5MB per image
                    </p>
                  </div>
                )}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="relative">
                        <img
                          src={`data:${attachment.fileType};base64,${attachment.fileData}`}
                          alt={attachment.fileName}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        {(attachment.uploadedBy === userId || userRole === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comments ({comments.length})
                </h3>
                <form onSubmit={handleAddComment} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Add Comment
                  </button>
                </form>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            User ID: {comment.userId.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {(comment.userId === userId || userRole === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
