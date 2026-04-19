import axios from "axios";

const resourceApi = axios.create({
  baseURL: "http://localhost:8080/api/resources",
});

export const getResources = (params) => resourceApi.get("", { params });
export const getResourceById = (id) => resourceApi.get(`/${id}`);
export const createResource = (data) => resourceApi.post("", data);
export const updateResource = (id, data) => resourceApi.put(`/${id}`, data);
export const deleteResource = (id) => resourceApi.delete(`/${id}`);

export default resourceApi;