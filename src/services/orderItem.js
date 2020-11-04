import axios from "axios";
import { END_POINT } from "../constants";
import { getHeaders } from "./auth";

export const getOrderItems = async (status, menu) => {
  try {
    let url;
    if (status !== "_" && menu !== "_") {
      url = `${END_POINT}/orderItems?status=${status}&menu=${menu}`;
    } else if (status !== "_") {
      url = `${END_POINT}/orderItems?status=${status}`;
    } else if (menu !== "_") {
      url = `${END_POINT}/orderItems?menu=${menu}`;
    } else {
      url = `${END_POINT}/orderItems`;
    }
    const orderItems = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (orderItems) {
      let data = orderItems?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get orderItmes error:", error);
  }
};
