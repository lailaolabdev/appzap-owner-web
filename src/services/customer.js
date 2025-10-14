import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getCustomers = async (storeId, findBy) => {
  try {
    const url = `${END_POINT_APP}/v7/customers${findBy}&storeId=${storeId}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const createCustomerCount = async (data) => {
  try {
    const url = `${END_POINT_APP}/v7/customer-amount/create`;
    const res = await axios.post(url, data, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};