import axios from "axios";
import { END_POINT } from "../constants";
import { getHeaders } from "./auth";
import { END_POINT_SEVER_BILL_ORDER, END_POINT_SEVER_TABLE_MENU } from "../constants/api";

export const getTables = async () => {
  try {
    const tables = await axios.get(`${END_POINT_SEVER_TABLE_MENU}/tables`);
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

export const getTableWithOrder = async () => {
  try {
    const url = `${END_POINT_SEVER_BILL_ORDER}/orders?status=ACTIVE`;
    const orders = await axios.get(url, {
      headers: await getHeaders(),
    });
    const newOrders = orders?.data;

    const tables = await axios.get(`${END_POINT_SEVER_TABLE_MENU}/tables`);
    if (tables && newOrders) {
      let data = tables?.data;
      let tableLen = data.length;
      let arr = [];
      for (let table of data) {
        arr[table.table_id] = [table.table_id, null, null];
      }
      for (const order of newOrders) {
        let table_id = order.table_id;
        for (let i = 0; i < tableLen; i++) {
          if (table_id === data[i].table_id) {
            arr[table_id] = [table_id, order];
          }
        }
      }

      let newArr = [];
      // let code = "";
      let index = 1;
      for (let i = 1; i < arr.length; i++) {
        if (i < 10) {
          index = "0" + index;
        }
        newArr.push({ table_id: arr[index][0], order: arr[index][1] });
        index++;
      }

      return newArr;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get tables error:", error);
  }
};
export const generatedCode = async (data) => {
  try {
    const geneartedCode = await axios.post(`${END_POINT_SEVER_TABLE_MENU}/generates`, {
      table_id: data,
    });
    if (geneartedCode) {
      let data = geneartedCode.data;
      return data.code;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get genearted code error:", error);
  }
};
export const getManyTables = async (storeId) => {
  try {
    const geneartedCode = await axios.get(`${END_POINT_SEVER_TABLE_MENU}/v3/tables/${storeId}`);
    console.log({})
    if (geneartedCode) {
      let data = geneartedCode.data;
      return data;
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
      `${END_POINT_SEVER_BILL_ORDER}/orders?status=CART&tableId=${tableId}`,
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
    await axios.put(`${END_POINT_SEVER_BILL_ORDER}/orderItems/${tableId}`, data);
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getOrders = async (data) => {
  try {
    const orders = await axios.get(`${END_POINT_SEVER_BILL_ORDER}/orders?status=ACTIVE`, {
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
