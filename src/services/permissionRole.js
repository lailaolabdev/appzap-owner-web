import { END_POINT_APP } from "../constants/api";
import axios from "axios";
// get all data
const getPermissionRoles = async () => {
  try {
    const response = await axios.get(`${END_POINT_APP}/v7/permission-role`);
    return response.data
  } catch (error) {
    console.error("Error fetching permission roles:", error);
  }
};
const getOnePermissionRoles = async (id) => {
  try {
    const response = await axios.get(`${END_POINT_APP}/v7/permission-role/${id}`);
    console.log("PermissionRoles:", response.data);
  } catch (error) {
    console.error("Error fetching permission roles:", error);
  }
};

// create
const createPermissionRole = async (data) => {
    try {
      console.log("Sending to API:", data.data);
      const response = await axios.post(`${END_POINT_APP}/v7/create-permission-role`, data.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      throw error;
    }
  };

// update
const updatePermissionRole = async (id, data) => {
  try {
    const response = await axios.put(`${END_POINT_APP}/v7/update-permission-role/${id}`, data);
    console.log("Updated PermissionRole:", response.data);
  } catch (error) {
    console.error("Error updating permission role:", error);
  }
};

// delete
const deletePermissionRole = async (id) => {
  try {
    const response = await axios.delete(`${END_POINT_APP}/v7/delete-permission-role/${id}`);
    console.log("Deleted PermissionRole:", response.data);
  } catch (error) {
    console.error("Error deleting permission role:", error);
  }
};

export { getPermissionRoles, createPermissionRole, updatePermissionRole, deletePermissionRole };
