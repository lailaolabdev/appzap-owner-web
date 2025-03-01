import { END_POINT_APP } from "../constants/api";
import axios from "axios";
// get all data
const getPermissionRoles = async (storeId) => {
  try {
    const response = await axios.get(`${END_POINT_APP}/v7/permission-role`, {
      params: { storeId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching permission roles:", error);
  }
};



// create
const createPermissionRole = async (data) => {
  try {
    const response = await axios.post(`${END_POINT_APP}/v7/create-permission-role`, data);
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
    return response.data;
  } catch (error) {
    console.error("Error updating permission role:", error);
  }
};


// delete
const deletePermissionRole = async (id, storeId) => {
  try {
     await axios.delete(`${END_POINT_APP}/v7/delete-permission-role/${id}`, {
      params: { storeId }
    });
  } catch (error) {
    console.error("Error deleting permission role:", error);
  }
};


export { getPermissionRoles, createPermissionRole, updatePermissionRole, deletePermissionRole };
