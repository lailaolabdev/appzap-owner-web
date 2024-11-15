
import axios from 'axios';
import { PERMISSIONS_COUNTER } from '../constants/api';
import { getHeaders } from "./auth";

export const fetchPermissionsCounter = async (storeId) => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${PERMISSIONS_COUNTER}/${storeId}`, {
      headers
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createPermissionsCounter = async (storeId, permissionsCounter) => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(PERMISSIONS_COUNTER, 
      {
        storeId,
        permissionsCounter
      },
      {
        headers
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePermissionsCounter = async (storeId, permissionsCounter) => {
  try {
    const headers = await getHeaders();
    const response = await axios.put(
      `${PERMISSIONS_COUNTER}/${storeId}`,
      {
        permissionsCounter
      },
      {
        headers
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};