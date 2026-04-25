import axiosInstance from "./axios";

const RESOURCE_BASE = "/api/resources";

export const getResources = (params) => axiosInstance.get(RESOURCE_BASE, { params });
export const getAllResources = () => axiosInstance.get(RESOURCE_BASE);
export const searchResources = (params) =>
  axiosInstance.get(`${RESOURCE_BASE}/search`, { params });
export const getResourceById = (id) => axiosInstance.get(`${RESOURCE_BASE}/${id}`);
export const createResource = (data) => axiosInstance.post(RESOURCE_BASE, data);
export const updateResource = (id, data) =>
  axiosInstance.put(`${RESOURCE_BASE}/${id}`, data);
export const deleteResource = (id) => axiosInstance.delete(`${RESOURCE_BASE}/${id}`);

export default {
  getResources,
  getAllResources,
  searchResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};