import axios from "axios";
import { END_POINT } from "../constants";
import { getHeaders } from "./auth";

export const tables = async () => {
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

// TO DO: get generatedCode

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

export const getOrderData = async () => {
  try {
    const orderData = await axios.get(`${END_POINT}/orders?status=CART`, {
      headers: getHeaders(),
    });
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

// openTable

// export const openTable = async (data) => {
//     try {
//         const dataOpenTable = await axios.post(`${END_POINT}/opens`, { code: data, customer_nickname: data });
//         if (dataOpenTable) {
//             let data = dataOpenTable.data;
//             console.log("data: ", data);
//             return data
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
