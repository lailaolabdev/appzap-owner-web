import axios from "axios";
import { END_POINT } from "../constants";
import { getHeaders } from "./auth";

export const getTables = async () => {
  try {
    const tables = await axios.get(`${END_POINT}/tables`);
    if (tables) {
      let data = tables?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get tables error:", error);
  }
};

export const generatedCode = async (data) => {
  try {
    const geneartedCode = await axios.post(`${END_POINT}/generates`, {
      table_id: data,
    });
    if (geneartedCode) {
      let data = geneartedCode.data;
      console.log("dataa:", data.code);
      return data.code;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get genearted code error:", error);
  }
};

// TO DO: get Order

export const getOrderData = async (tableId) => {
  try {
    const orderData = await axios.get(
      `${END_POINT}/orders?status=CART&tableId=${tableId}`,
      {
        headers: await getHeaders(),
      }
    );
    if (orderData) {
      let data = orderData?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateOrderData = async (tableId, data) => {
  try {
    const res = await axios.put(`${END_POINT}/orderItems/${tableId}`, data);
    console.log("res", res);
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getOrders = async (data) => {
  try {
    const orders = await axios.get(`${END_POINT}/orders?status=ACTIVE`, {
      headers: await getHeaders(),
    });
    if (orders) {
      let data = orders?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
