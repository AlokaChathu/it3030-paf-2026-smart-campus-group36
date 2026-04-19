import { useEffect, useState } from "react";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../api/resourceApi";
import "./ResourcesPage.css";

const initialForm = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  availabilityStart: "",
  availabilityEnd: "",
  status: "ACTIVE",
};

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    capacity: "",
    location: "",
    status: "",
  });

  const fetchResources = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.capacity) params.capacity = filters.capacity;
      if (filters.location) params.location = filters.location;
      if (filters.status) params.status = filters.status;

      const res = await getResources(params);
      setResources(res.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: Number(form.capacity),
    };

    try {
      if (editingId) {
        await updateResource(editingId, payload);
        alert("Resource updated successfully");
      } else {
        await createResource(payload);
        alert("Resource added successfully");
      }

      setForm(initialForm);
      setEditingId(null);
      fetchResources();
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("Failed to save resource");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      location: resource.location,
      availabilityStart: resource.availabilityStart || "",
      availabilityEnd: resource.availabilityEnd || "",
      status: resource.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmed) return;

    try {
      await deleteResource(id);
      alert("Resource deleted successfully");
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
    }
  };

  const applyFilters = () => {
    fetchResources();
  };

  const clearFilters = async () => {
    const cleared = {
      type: "",
      capacity: "",
      location: "",
      status: "",
    };
    setFilters(cleared);

    try {
      const res = await getResources();
      setResources(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="resources-page">
      <h1>Facilities Catalogue & Resource Management</h1>

      <div className="resource-card">
        <h2>{editingId ? "Edit Resource" : "Add New Resource"}</h2>

        <form onSubmit={handleSubmit} className="resource-form">
          <input
            type="text"
            name="name"
            placeholder="Resource Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="PROJECTOR">Projector</option>
            <option value="CAMERA">Camera</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <div>
            <label>Availability Start</label>
            <input
              type="time"
              name="availabilityStart"
              value={form.availabilityStart}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Availability End</label>
            <input
              type="time"
              name="availabilityEnd"
              value={form.availabilityEnd}
              onChange={handleChange}
            />
          </div>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>

          <div className="btn-group">
            <button type="submit">{editingId ? "Update Resource" : "Add Resource"}</button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="resource-card">
        <h2>Search & Filter Resources</h2>
        <div className="filter-grid">
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="PROJECTOR">Projector</option>
            <option value="CAMERA">Camera</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="number"
            name="capacity"
            placeholder="Minimum Capacity"
            value={filters.capacity}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>

        <div className="btn-group">
          <button onClick={applyFilters}>Apply Filters</button>
          <button className="cancel-btn" onClick={clearFilters}>Clear</button>
        </div>
      </div>

      <div className="resource-card">
        <h2>All Resources</h2>
        <div className="table-wrapper">
          <table className="resource-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.id}</td>
                    <td>{resource.name}</td>
                    <td>{resource.type}</td>
                    <td>{resource.capacity}</td>
                    <td>{resource.location}</td>
                    <td>
                      {resource.availabilityStart || "-"} to {resource.availabilityEnd || "-"}
                    </td>
                    <td>{resource.status}</td>
                    <td>
                      <button onClick={() => handleEdit(resource)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(resource.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No resources found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;