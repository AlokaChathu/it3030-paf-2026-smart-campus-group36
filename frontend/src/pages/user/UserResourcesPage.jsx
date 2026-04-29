import { useEffect, useState } from "react";
import { getAllResources, searchResources } from "../../api/resourceApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "../admin/ResourcesPage.css";

export default function UserResourcesPage() {
  const [resources, setResources] = useState([]);
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

  // ✅ Auto search when typing/selecting filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const loadResources = async () => {
    try {
      const res = await getAllResources();
      setResources(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Failed to load resources");
    }
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
      if (filters.minCapacity !== "") {
        query.minCapacity = Number(filters.minCapacity);
      }

      const res =
        Object.keys(query).length === 0
          ? await getAllResources()
          : await searchResources(query);

      setResources(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Search failed");
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
  };

  const totalResources = resources.length;

const activeResources = resources.filter(
  (resource) => resource.status === "ACTIVE"
).length;

const outOfServiceResources = resources.filter(
  (resource) => resource.status === "OUT_OF_SERVICE"
).length;

const labResources = resources.filter(
  (resource) => resource.type === "LAB"
).length;

  return (
    <DashboardLayout title="All Resources">
      <div className="resources-page">
        {message && <div className="message-box">{message}</div>}

        <section className="filter-card">
          <h2>Search</h2>

          <div className="filter-grid">
            <input
              name="keyword"
              placeholder="Search by name"
              value={filters.keyword}
              onChange={handleFilterChange}
            />

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="PROJECTOR">Projector</option>
              <option value="CAMERA">Camera</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
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
            <button
              type="button"
              className="secondary-btn"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="summary-cards-grid">
  <div className="resource-summary-card">
    <h3>{totalResources}</h3>
    <p>Total Resources</p>
  </div>

  <div className="resource-summary-card active-card">
    <h3>{activeResources}</h3>
    <p>Active Resources</p>
  </div>

  <div className="resource-summary-card danger-card">
    <h3>{outOfServiceResources}</h3>
    <p>Out of Service</p>
  </div>

  <div className="resource-summary-card lab-card">
    <h3>{labResources}</h3>
    <p>Labs</p>
  </div>
</section>

        <section className="table-card">
          <h2>All Resources</h2>
          <p className="section-note">
            View all resources currently available in the system
          </p>

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
                </tr>
              </thead>

              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
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
                        <span
                          className={`status ${resource.status?.toLowerCase()}`}
                        >
                          {resource.status?.replaceAll("_", " ")}
                        </span>
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