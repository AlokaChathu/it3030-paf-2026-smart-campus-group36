import { useEffect, useState } from "react";
import {
  createResource,
  deleteResource,
  getAllResources,
  searchResources,
  updateResource,
} from "../../api/resourceApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./ResourcesPage.css";

const emptyForm = {
  name: "",
  type: "",
  capacity: "",
  location: "",
  availableFrom: "08:00",
  availableTo: "17:00",
  status: "ACTIVE",
  description: "",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    status: "",
    location: "",
    minCapacity: "",
  });

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const loadResources = async () => {
    try {
      const res = await getAllResources();
      setResources(res.data);
    } catch (error) {
      setMessage("Failed to load resources");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const query = {};
      if (filters.keyword.trim()) query.keyword = filters.keyword.trim();
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      if (filters.location.trim()) query.location = filters.location.trim();
      if (filters.minCapacity !== "") query.minCapacity = Number(filters.minCapacity);

      const res =
        Object.keys(query).length === 0 ? await getAllResources() : await searchResources(query);
      setResources(res.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Search failed");
    }
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      type: "",
      status: "",
      location: "",
      minCapacity: "",
    });
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.capacity) <= 0) {
      setMessage("Capacity must be greater than 0");
      return;
    }

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (editingId) {
        await updateResource(editingId, payload);
        setMessage("Resource updated successfully");
      } else {
        await createResource(payload);
        setMessage("Resource created successfully");
      }

      resetForm();
      loadResources();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      location: resource.location,
      availableFrom: resource.availableFrom,
      availableTo: resource.availableTo,
      status: resource.status,
      description: resource.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      setMessage("Resource deleted successfully");
      loadResources();
    } catch (error) {
      setMessage("Delete failed");
    }
  };

  return (
    <DashboardLayout title="Resource Management">
      <div className="resources-page">
        <div className="resources-header">
          <div>
            <h1>Resource Management</h1>
            <p>
              Manage campus facilities and assets with a clean and organized
              admin workspace.
            </p>
            
          </div>
          <div className="summary-card">
            <h3>{resources.length}</h3>
            <span>Total Resources</span>
          </div>
        </div>

        {message && <div className="message-box">{message}</div>}

        <section className="resource-form-card">
          <h2>{editingId ? "Update Resource" : "Add New Resource"}</h2>
          <p className="section-note">Fill in the resource details and save changes</p>

          <form onSubmit={handleSubmit} className="resource-form">
            <input
              name="name"
              placeholder="Resource Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select Resource Type</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="PROJECTOR">Projector</option>
              <option value="CAMERA">Camera</option>
              <option value="OTHER">Other</option>
            </select>

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            />

            <div className="time-inputs">
              <div>
                <label>Available From</label>
                <input
                  name="availableFrom"
                  type="time"
                  value={form.availableFrom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Available To</label>
                <input
                  name="availableTo"
                  type="time"
                  value={form.availableTo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Available</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>

            <div className="form-actions">
              <button type="submit">{editingId ? "Update Resource" : "Add Resource"}</button>
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="filter-card">
          <h2>Search</h2>

          <div className="filter-grid">
            <input
              name="keyword"
              placeholder="Search by name"
              value={filters.keyword}
              onChange={handleFilterChange}
            />

            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="PROJECTOR">Projector</option>
              <option value="CAMERA">Camera</option>
              <option value="OTHER">Other</option>
            </select>

            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>

            <input
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />

            <input
              name="minCapacity"
              type="number"
              placeholder="Min capacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <button type="button" className="secondary-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </section>

        <section className="table-card">
          <h2>All Resources</h2>
          <p className="section-note">View all resources currently available in the system</p>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      No resources available
                    </td>
                  </tr>
                ) : (
                  resources.map((resource) => (
                    <tr key={resource.id}>
                      <td>{resource.id}</td>
                      <td>{resource.name}</td>
                      <td>{resource.type?.replaceAll("_", " ")}</td>
                      <td>{resource.location}</td>
                      <td>{resource.capacity}</td>
                      <td>
                        <span className={`status ${resource.status?.toLowerCase()}`}>
                          {resource.status?.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEdit(resource)}>Edit</button>
                          <button className="danger-btn" onClick={() => handleDelete(resource.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}