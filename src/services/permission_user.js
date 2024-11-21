import Axios from "axios";
import { END_POINT_SEVER } from "../constants/api";

export const fetchPermissionUsers = async (storeId) => {
  if (!storeId) throw new Error("Store ID is required.");
  const response = await Axios.get(`${END_POINT_SEVER}/v5/permission-user?storeId=${storeId}`);
  return response.data.data;
};

export const createPermissionUser = async (storeId, permissionUserName) => {
  if (!storeId || !permissionUserName) throw new Error("Store ID and Permission User Name are required.");
  const response = await Axios.post(`${END_POINT_SEVER}/v5/permission-user`, {
    storeId,
    permissionUserName,
  });
  return response.data;
};

export const updatePermissionUser = async (id, permissionUserName, createdBy) => {
  if (!id || !permissionUserName || !createdBy) throw new Error("ID, Permission User Name, and Created By are required.");
  const response = await Axios.put(`${END_POINT_SEVER}/v5/permission-user/${id}`, {
    permissionUserName,
    createdBy,
  });
  return response.data;
};

export const deletePermissionUser = async (storeId) => {
  if (!storeId) throw new Error("ID is required.");
  const response = await Axios.delete(`${END_POINT_SEVER}/v5/permission-user/${storeId}`);
  return response.data;
};
